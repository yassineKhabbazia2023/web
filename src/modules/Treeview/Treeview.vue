<template>
  <div class="treeview" :class="{ 'treeview--is-loading': isLoading }">
    <div v-if="isLoading" class="treeview__loader">
      <PLoader pType="gradient" size="42" />
    </div>

    <div v-else-if="defaultFolder !== null">
      <CreateFolderSection
        :serviceId="currentService"
        :entityId="selectedEntity"
        :selectedFolder="selectedFolder"
        :isCreateFolderModalVisible="isCreateFolderModalVisible"
        :isInBinContext="isInBinContext"
        hasCreateFolderButton
        @update-source-folders="handleOnTreeContentRefresh"
        @on-close-create-folder="handleCloseCreateFolderModal"
      />

      <DeleteFolderSection
        :serviceId="currentService"
        :entityId="selectedEntity"
        :isDeleteFolderPopupVisible="isDeleteFolderPopupVisible"
        :selectedFolder="selectedFolder"
        @on-delete-folder-completed="handleDeleteFolderCompleted"
        @on-close-delete-folder="handleCloseDeleteFolderModal"
      />

      <FoldersMove
        v-if="toolBoxSelectedFolder && folderMovingDestination && currentServiceFolder"
        :folder="folderMovingDestination"
        :currentService="currentService"
        :folderToMove="toolBoxSelectedFolder"
        :isMoveModalOpened="isMoveFolderModalOpened"
        :currentServiceFolder="currentServiceFolder"
        :selectedEntity="selectedEntity"
        @close-move-folder-modal="handleCloseMoveFolderModal"
        @update-source-folders="handleOnTreeContentRefresh"
        @refresh-tree="propagateRefreshTree"
      />

      <RenameFolderSection
        :serviceId="currentService"
        :entityId="selectedEntity"
        :folderName="currentFolderName"
        :folderId="currentFolderId"
        :parentFolder="parentNodeOfSelectedFolderTreeNodeAction"
        :isRenameFolderModalVisible="isRenameFolderModalVisible"
        @update-folder-name="handleUpdateFolderName"
        @on-close-rename-folder="handleRenameFolderModal"
      />

      <div class="treeview__trees">
        <PScrollbar>
          <PTree
            v-for="(serviceFolder, index) in extendedServiceFolders"
            :pCurrentNodeKey="!index ? initialSelectedNodeId : ''"
            :pData="serviceFolder"
            :pDefaultExpandedKeys="!index ? defaultExpandedKey : []"
            pHasCustomNodes
            :key="serviceFolder[0].id"
            pNodeKey="id"
            ref="treesRefs"
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
/* eslint-disable vitest/require-hook */

import type { ComputedRef } from 'vue'
import { computed, ref, watch } from 'vue'
import TreeNode from '@/modules/Treeview/components/TreeNode'
import { formatBinData } from './helpers/binHelper'
import type { TreeviewProps, TreeType, ExtendedFolder } from './TreeviewTypes'
import type { Folder } from '@/models/Folder'
import type { Bin } from '@/models/Bin'
import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'
import DeleteFolderSection from '@/modules/Treeview/sections/DeleteFolder'
import { PScrollbar, PTree, PLoader } from '@kpmg/styleguide'
import RenameFolderSection from '@/modules/Treeview/sections/RenameFolder'
import { findFolderDeepById } from './helpers/folderArrayHelper'
import type { DownloadFolderComposableProps } from './sections/DownloadFolder/DownloadFolderTypes'
import { useDownloadFolder } from './sections/DownloadFolder/DownloadFolderSection'
import FoldersMove from './components/modals/FoldersMove'
const props = defineProps<TreeviewProps>()
const emit = defineEmits([
  'selected-folder-change',
  'selected-bin-service-change',
  'open-create-folder-modal',
  'update-source-folders',
  'selected-bin-service-change',
  'remove-folder-from-source',
  'update-folder-name',
  'refresh-tree',
])
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
  if (!defaultFolder.value) return
  return defaultFolder.value.id
})

watch(
  () => props.isLoading,
  () => {
    if (props.isLoading === true) return
    defaultFolder.value = props.servicesFolders[0][0].children[0]
    emit('selected-folder-change', defaultFolder.value)
  },
)

const treeNodeSelectedFolder = ref()

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
    if (!selectedFolder) return
    if (selectedFolder === treeNodeSelectedFolder.value) return

    const tree = retrieveCurrentlyUsedSourceTree()
    if (!tree) return
    treeNodeSelectedFolder.value = selectedFolder
    tree.setCurrentKey(selectedFolder.id)
  },
)

const parentNodeOfSelectedFolderTreeNodeAction = ref()

const setParentNodeOfSelectedFolderTreeNodeAction = () => {
  const parentFolderId = treeNodeSelectedFolder.value?.parent?.id
  parentNodeOfSelectedFolderTreeNodeAction.value = findFolderDeepById(
    props.servicesFolders[0].filter(
      (f) => f.serviceId === props.currentService,
    ),
    parentFolderId,
  ) as Folder
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
  if (e.isRootFolder) return
  emit('selected-bin-service-change', e.id)
}

const treesRefs = ref<TreeType[]>([])
const retrieveUnusedTrees = (): TreeType[] => {
  return treesRefs.value.filter(
    (tree) => tree.pData[0].serviceId !== props.currentService,
  )
}
const retrieveCurrentlyUsedSourceTree = (): TreeType => {
  const usedTree = treesRefs.value.filter(
    (tree) => tree.pData[0].serviceId === props.currentService,
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
  if (!unusedSourceTreesRefs.length) return

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

const handleToolboxItemChecked = (action: string, folder: Folder) => {
  if (action === 'toolbox-delete-action-click') {
    treeNodeSelectedFolder.value = folder
    isDeleteFolderPopupVisible.value = true
  } else if (action === 'toolbox-rename-action-click') {
    treeNodeSelectedFolder.value = folder
    setParentNodeOfSelectedFolderTreeNodeAction()
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

// eslint-disable-next-line vitest/require-hook
watch(
  () => props.currentService,
  () => {
    collapseUnusedTrees()
  },
)
</script>

<style lang="scss">
@use '@/utils/breakpoints';

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

  &__new-folder {
    margin: 8px 0 0 8px;
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
