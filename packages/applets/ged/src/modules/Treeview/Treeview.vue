<template>
  <div class="treeview" :class="{ 'treeview--is-loading': isLoading }">
    <div v-if="isLoading || currentServiceName === null" class="treeview__loader">
      <PLoader pType="primary" size="42" />
    </div>

    <div v-else-if="defaultFolder !== null" class="padding-top--4">
      <div class="padding-left--2">
        <CreateFolderSection
          :entityId="selectedEntity"
          :isCreateFolderModalVisible="isCreateFolderModalVisible"
          :isInBinContext="isInBinContext"
          :selectedFolder="selectedFolder"
          :serviceId="currentService"
          hasCreateFolderButton
          @on-close-create-folder="handleCloseCreateFolderModal"
          @update-source-folders="handleOnTreeContentRefresh"
        />
      </div>

      <DeleteFolderSection
        :entityId="selectedEntity"
        :isDeleteFolderPopupVisible="isDeleteFolderPopupVisible"
        :serviceId="currentService"
        :selectedFolder="selectedFolder"
        @on-delete-folder-completed="handleDeleteFolderCompleted"
        @on-close-delete-folder="handleCloseDeleteFolderModal"
      />

      <FoldersMove
        v-if="toolBoxSelectedFolder && folderMovingDestination && currentServiceFolder"
        :currentService="currentService"
        :currentServiceFolder="currentServiceFolder"
        :folder="folderMovingDestination"
        :folderToMove="toolBoxSelectedFolder"
        :isMoveModalOpened="isMoveFolderModalOpened"
        :selectedEntity="selectedEntity"
        @close-move-folder-modal="handleCloseMoveFolderModal"
        @refresh-tree="propagateRefreshTree"
        @update-source-folders="handleOnTreeContentRefresh"
      />

      <RenameFolderSection
        v-if="parentNodeOfSelectedFolderTreeNodeAction"
        :entityId="selectedEntity"
        :folderId="currentFolderId"
        :folderName="currentFolderName"
        :isRenameFolderModalVisible="isRenameFolderModalVisible"
        :parentFolder="parentNodeOfSelectedFolderTreeNodeAction"
        :serviceId="currentService"
        @on-close-rename-folder="handleRenameFolderModal"
        @update-folder-name="handleUpdateFolderName"
      />

      <DocumentsDropConfirmationPopup
        v-if="isDropDialogVisible"
        v-model="isDropDialogVisible"
        :destinationPath="dropDestinationFolder"
        :isDocumentDropConfirmButtonLoading="isDocumentDropConfirmButtonLoading"
        :numberOfDocumentsToDrop="numberOfDocumentsToDrop"
        @confirm-documents-drop="handleConfirmDocumentDrop"
      />

      <div class="treeview__trees">
        <PScrollbar>
          <PTree
            v-for="(serviceFolder, index) in extendedServiceFolders"
            :key="serviceFolder[0].id"
            ref="treesRefs"
            :pCurrentNodeKey="!index ? initialSelectedNodeId : ''"
            :pData="serviceFolder"
            :pDefaultExpandedKeys="!index ? defaultExpandedKey : []"
            pHasCustomNodes
            pNodeKey="id"
            @p-tree-node-clicked="handleFolderNodeClick"
          >
            <template #default="{ node, data }">
              <TreeNode
                :serviceId="currentService"
                :entityId="selectedEntity"
                :node="node"
                :data="data"
                :selectedFolder="
                  selectedFolder || props.servicesFolders[0][0].children[0]
                "
                @p-toolbox-item-clicked="handleToolboxItemChecked"
                @documents-dropped-on-tree-node="handleDocumentDroppedOnTreeNode"
                @expand-or-collapse-node="handleExpandOrCollapseNode"
              />
            </template>
          </PTree>

          <PTree
            ref="binTree"
            class="bin-tree"
            :pData="binTreeData"
            pHasCustomNodes
            pNodeKey="id"
            @p-tree-node-clicked="handleBinNodeClick"
          >
            <template #default="{ node, data }">
              <TreeNode :node="node" :data="data" />
            </template>
          </PTree>
        </PScrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import TreeNode from '@ged/modules/Treeview/components/TreeNode'
import { formatBinData } from './helpers/binHelper'
import type { TreeviewProps, TreeType, ExtendedFolder } from './TreeviewTypes'
import type { Folder } from '@ged/models/Folder'
import type { Bin } from '@ged/models/Bin'
import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'
import DeleteFolderSection from '@ged/modules/Treeview/sections/DeleteFolder'
import { PScrollbar, PTree, PLoader } from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import RenameFolderSection from '@ged/modules/Treeview/sections/RenameFolder'
import { findFolderDeepById } from './helpers/folderArrayHelper'
import type { DownloadFolderComposableProps } from './sections/DownloadFolder/DownloadFolderTypes'
import { useDownloadFolder } from './sections/DownloadFolder/DownloadFolderSection'
import FoldersMove from './components/modals/FoldersMove'
import DocumentsDropConfirmationPopup from '@ged/modules/Treeview/components/popups/DocumentsDrop'
import { getPathFromArray } from '@ged/modules/Documents/helpers/pathBuildingHelper'
import { getFolderPath } from '@ged/modules/Treeview/helpers/folderArrayHelper'
import type { Document } from '@ged/models/Document'
import { moveDocuments } from '@ged/services/Documents'
import { useI18n } from 'vue-i18n'
import { trackDocumentMove } from '@ged/services/tracking/tracking.service'
import { logger } from '@pulse/core'

const props = defineProps<TreeviewProps>()
const emit = defineEmits([
  'selected-folder-change',
  'selected-bin-service-change',
  'open-create-folder-modal',
  'update-source-folders',
  'remove-folder-from-source',
  'update-folder-name',
  'refresh-tree',
  'refresh-documents-list',
])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const downloadFolderProps: ComputedRef<DownloadFolderComposableProps> =
  computed(() => {
    return {
      selectedFolderName: currentFolderName.value,
      selectedFolderId: currentFolderId.value,
      currentService: props.currentService,
      selectedEntity: props.selectedEntity,
    }
  })

const { handleDownloadFolderEvent } = useDownloadFolder(downloadFolderProps)
// This always exists as it is the default structure of any service
const defaultFolder = ref<null | Folder>(null)
const initialSelectedNodeId = computed(() => {
  if (!defaultFolder.value) {
    return
  }
  return defaultFolder.value.id
})

watch(
  () => props.isLoading,
  () => {
    if (props.isLoading === true) {
      return
    }
    try {
      if(props.servicesFolders.length) {
        defaultFolder.value = props.servicesFolders[0][0].children[0]
        emit('selected-folder-change', defaultFolder.value)
      }
    } catch (error) {
      logger.error(error)
    }
  },
)

const treeNodeSelectedFolder = ref<Folder>()

const selectedFolder = computed((): Folder => {
  if (treeNodeSelectedFolder.value) {
    return treeNodeSelectedFolder.value
  }

  return props.selectedFolder || props.servicesFolders[0][0].children[0]
})

const extendedServiceFolders = computed(() => {
  return addAttributeIsRootFolder(props.servicesFolders)
})

watch(
  () => props.selectedFolder,
  () => {
    const { selectedFolder } = props
    if (!selectedFolder) {
      return
    }
    if (selectedFolder === treeNodeSelectedFolder.value) {
      return
    }

    const tree = retrieveCurrentlyUsedSourceTree()
    if (!tree) {
      return
    }
    treeNodeSelectedFolder.value = selectedFolder
    tree.setCurrentKey(selectedFolder.id)
  },
)

const parentNodeOfSelectedFolderTreeNodeAction = ref<Folder>()

const setParentNodeOfSelectedFolderTreeNodeAction = () => {
  const parentFolderId = treeNodeSelectedFolder.value?.parent?.id
  if (!parentFolderId) {
    return
  }

  const currentServiceFolders = props.servicesFolders.find(
    serviceFolders => serviceFolders[0].serviceId === treeNodeSelectedFolder.value?.serviceId,
  )
  if (!currentServiceFolders) {
    return
  }
  const folderId = findFolderDeepById(
    currentServiceFolders,
    parentFolderId,
  )
  parentNodeOfSelectedFolderTreeNodeAction.value = folderId
}
const currentFolderId = ref(0)

const isCreateFolderModalVisible = ref(false)
const isDeleteFolderPopupVisible = ref(false)
const isRenameFolderModalVisible = ref(false)

const currentFolderName = ref(
  props.selectedFolder ? props.selectedFolder.name : '',
)

const defaultExpandedKey = computed(() => [props.servicesFolders[0][0].id])

const handleFolderNodeClick = (e: Folder) => {
  // This retrieves the source bin tree in order to collapse it
  // as we've just clicked a domain folder
  const sourceBinTree = retrieveSourceTrees([binTree.value])
  collapseGivenTrees(sourceBinTree)
  treeNodeSelectedFolder.value = e
  emit('selected-folder-change', e)
}

const determineIsRootFolder = (folder: ExtendedFolder): boolean => {
  return folder.parent === undefined || folder.parent.id === 0
}

const addAttributeIsRootFolder = (servicesFolders: ExtendedFolder[][]) => {
  return servicesFolders.map((service) =>
    service.map((folder) => ({
      ...folder,
      isRootFolder: determineIsRootFolder(folder),
    })),
  )
}
const binTree = ref<TreeType | null>(null)
// I could have use the "props" prop on the Tree that is used to do a property mapping
// But as there's computation in the TreeNode, I need to map it to have a consistent property naming
const binTreeData = computed(() => formatBinData(props.entityServices))

const handleBinNodeClick = (e: Bin) => {
  // This retrieves the source domain trees in order to collapse them
  // as we've just clicked on a bin folder
  const foldersTrees = retrieveSourceTrees(treesRefs.value)
  collapseGivenTrees(foldersTrees)
  if (e.isRootFolder) {
    return
  }
  emit('selected-bin-service-change', e.id)
}

const treesRefs = ref<TreeType[]>([])
const retrieveUnusedTrees = (): TreeType[] => {
  return treesRefs.value.filter(
    (tree) => tree.pData?.at(0).serviceId !== props.currentService,
  )
}

const retrieveCurrentlyUsedSourceTree = (): TreeType => {
  const usedTree = treesRefs.value.filter(
    (tree) => tree.pData?.at(0).serviceId === props.currentService,
  )

  return retrieveSourceTrees(usedTree)[0]
}

// Retreiving the source trees allow us to used their internal exposed functions
const retrieveSourceTrees = (
  currentComponentTreeRefs: TreeType[],
): TreeType[] => {
  return currentComponentTreeRefs.map(
    (currentComponentTreeRef) => currentComponentTreeRef.$refs.treeElement,
  )
}

const collapseUnusedTrees = () => {
  const unusedComponentTreesRefs = retrieveUnusedTrees()
  const unusedSourceTreesRefs = retrieveSourceTrees(unusedComponentTreesRefs)
  if (!unusedSourceTreesRefs.length) {
    return
  }

  collapseGivenTrees(unusedSourceTreesRefs)
}

const collapseGivenTrees = (treesRefs: TreeType[]) => {
  treesRefs.forEach((treeRef) => {
    treeRef.setCurrentKey(null)
    treeRef.root.childNodes?.forEach((node: any) => {
      node.collapse()
    })
  })
}

// Create folder scope
const handleOnTreeContentRefresh = (folderData: Folder) => {
  emit('update-source-folders', folderData)
}
const handleCloseCreateFolderModal = () => {
  isCreateFolderModalVisible.value = false
}

// Rename folder scope
const handleUpdateFolderName = (folderData: Folder) => {
  emit('update-folder-name', folderData)
}
const handleRenameFolderModal = () => {
  isRenameFolderModalVisible.value = false
}

// Delete folder scope
const handleDeleteFolderCompleted = (folder: Folder) => {
  emit('remove-folder-from-source', folder)
}
const handleCloseDeleteFolderModal = () => {
  isDeleteFolderPopupVisible.value = false
}

// Move folder scope
const isMoveFolderModalOpened = ref(false)
const handleCloseMoveFolderModal = () => {
  isMoveFolderModalOpened.value = false
}

const propagateRefreshTree = (folderId: Folder['id']) => {
  emit('refresh-tree', folderId)
}

// ToolBox scope
const toolBoxSelectedFolder = ref<Folder>()

const folderMovingDestination = computed(() => {
  if (props.currentServiceFolder && toolBoxSelectedFolder.value === selectedFolder.value) {
    return findFolderDeepById(props.currentServiceFolder, selectedFolder.value.parent.id)
  }
  return selectedFolder.value
})

const handleToolboxItemChecked = async (action: string, folder: Folder) => {
  if (action === 'toolbox-delete-action-click') {
    treeNodeSelectedFolder.value = folder
    isDeleteFolderPopupVisible.value = true
  } else if (action === 'toolbox-rename-action-click') {
    treeNodeSelectedFolder.value = folder
    setParentNodeOfSelectedFolderTreeNodeAction()
    // Required otherwise the dialog doesn't exist yet and never opens
    await nextTick()
    currentFolderName.value = folder?.name
    currentFolderId.value = folder?.id
    isRenameFolderModalVisible.value = true
  } else if (action === 'toolbox-download-action-click') {
    currentFolderName.value = folder?.name
    currentFolderId.value = folder?.id
    handleDownloadFolderEvent()
  } else if (action === 'move-folder') {
    toolBoxSelectedFolder.value = folder
    isMoveFolderModalOpened.value = true
  } else {
    treeNodeSelectedFolder.value = folder
    isCreateFolderModalVisible.value = true
  }
}

// This is going to be a whole composable
function handleExpandOrCollapseNode(nodeKey: any) {
  const tree = retrieveCurrentlyUsedSourceTree()

  const nodeToCollapseOrExpand = tree?.getNode(nodeKey)
  if (nodeToCollapseOrExpand?.expanded) {
    nodeToCollapseOrExpand.collapse()
  } else {
    nodeToCollapseOrExpand?.expand()
  }
}

const documentDropDestinationFolder = ref<Folder['id'] | null>(null)
const documentDropDestinationFolderName = ref('')
const draggedDocumentsTomove = ref<Document[]>([])

function handleDocumentDroppedOnTreeNode(documents: Document[], targetFolder: Folder) {
  if (!props.currentServiceFolder) {
    return
  }

  draggedDocumentsTomove.value = documents

  const firstDocument = documents.at(0)
  if (!firstDocument) {
    return
  }

  const targetFolderPath = getFolderPath(props.currentServiceFolder, targetFolder)
  if (!targetFolderPath) {
    return
  }
  documentDropDestinationFolderName.value = targetFolderPath[targetFolderPath.length - 1]
  dropDestinationFolder.value = getPathFromArray(targetFolderPath)
  documentDropDestinationFolder.value = targetFolder.id
  isDropDialogVisible.value = true
}

const isDocumentDropConfirmButtonLoading = ref(false)
async function handleConfirmDocumentDrop() {
  if (!documentDropDestinationFolder.value) {
    return
  }

  const formattedMoveDocumentsRequest = formatMoveDocumentsRequest()

  if (!formattedMoveDocumentsRequest) {
    return
  }

  try {
    isDocumentDropConfirmButtonLoading.value = true
    await moveDocuments(
      props.currentService,
      props.selectedEntity,
      formattedMoveDocumentsRequest,
    )

    displaySuccessNotification(formattedMoveDocumentsRequest.ids.length)
    trackDocumentMove({ isMoveSuccessful: true })
    emit('refresh-documents-list', true)
  } catch (error) {
    displayErrorNotification(formattedMoveDocumentsRequest.ids.length)
    trackDocumentMove({ isMoveSuccessful: false })
  } finally {
    isDropDialogVisible.value = false
    isDocumentDropConfirmButtonLoading.value = false
  }
}

function displaySuccessNotification(droppedDocumentsCount: number) {
  PNotification({
    message: t(
      'dropSuccessNotification',
      {
        droppedDocumentsCount,
        folderName: dropDestinationFolder.value,
      },
      droppedDocumentsCount,
    ),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

function displayErrorNotification(droppedDocumentsCount: number) {
  PNotification({
    message: t(
      'dropErrorNotification',
      {
        droppedDocumentsCount,
        folderName: dropDestinationFolder.value,
      },
      droppedDocumentsCount,
    ),
    iconName: 'x',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

function formatMoveDocumentsRequest() {
  const documentsIds = draggedDocumentsTomove.value.map(document => document.id)
  const sourceFolderId = draggedDocumentsTomove.value.at(0)?.folder.id

  if (!sourceFolderId || !documentDropDestinationFolder.value) {
    return
  }
  return {
    ids: documentsIds,
    sourceFolderId,
    destinationFolderId: documentDropDestinationFolder.value,
    moveAll: false,
    serviceId: props.currentService,
  }
}

// drop popups and notifications managemnt
const isDropDialogVisible = ref(false)
const dropDestinationFolder = ref('')
const numberOfDocumentsToDrop = ref(0)
watch(
  () => props.currentService,
  () => {
    collapseUnusedTrees()
  },
)

// FIXME: do not expose variables for UT purpose (should change UT)
defineExpose({
  currentFolderId,
  currentFolderName,
})
</script>

<style lang="scss">
@use '@ged/utils/breakpoints';

.treeview {
  width: 100%;
  height: calc(100vh - 52px);
  max-height: calc(100vh - 52px);
  overflow: hidden;
  padding-bottom: 40px;

  border-right: 1px solid var(--el-color-neutral-gray-100);

  & > div:not(.treeview__loader) {
    height: 100%;
  }

  &--is-loading {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  &__loader {
    margin-top: 40px;
  }

  &__trees {
    height: 100%;
    max-height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: auto;
  }

  .el-tree {
    width: fit-content;
    min-width: 100%;
    overflow: auto;
  }

  .el-tree-node {
    display: flex;
    flex-direction: column;

    min-width: 100%;
    width: fit-content;
  }

  .el-tree-node__content {
    min-width: min-content;
  }
}
</style>

<i18n lang="yaml">
en-US:
  dropSuccessNotification: >
    {droppedDocumentsCount} document has been moved in {folderName} folder |
    {droppedDocumentsCount} documents have been moved in {folderName} folder
  dropErrorNotification: >
    Connection has been interrupted with {droppedDocumentsCount} document concerned |
    Connection has been interrupted with {droppedDocumentsCount} documents concerned
fr-FR:
  dropSuccessNotification: >
    {droppedDocumentsCount} document a été déplacé dans le dossier {folderName} |
    {droppedDocumentsCount} documents ont été déplacés dans le dossier {folderName}
  dropErrorNotification: >
    Connexion au serveur interrompue pour {droppedDocumentsCount} document |
    Connexion au serveur interrompue pour {droppedDocumentsCount} documents
</i18n>
