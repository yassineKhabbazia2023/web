<template>
  <div class="treeview" :class="{ 'treeview--is-loading': isLoading }">
    <div v-if="isLoading" class="treeview__loader">
      <PLoader type="gradient" size="42" />
    </div>

    <div v-else-if="defaultFolder !== null">
      <CreateFolderSection
        :serviceId="currentService"
        :entityId="selectedEntity"
        :selectedFolder="selectedFolder"
        :isCreateFolderModalVisible="isCreateFolderModalVisible"
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

      <RenameFolderSection
        :serviceId="currentService"
        :entityId="selectedEntity"
        :folderName="currentFolderName"
        :folderId = "currentFolderId"
        :parentFolder="parentNodeOfSelectedFolderTreeNodeAction"
        :isRenameFolderModalVisible="isRenameFolderModalVisible"
        @update-folder-name="handleUpdateFolderName"
        @on-close-rename-folder="handleRenameFolderModal"
      />

      <div class="treeview__trees">
        <PScrollbar>
          <PTree
            v-for="(serviceFolder, index) in servicesFolders"
            :currentNodeKey="!index ? initialSelectedNodeId : ''"
            :data="serviceFolder"
            :defaultExpandedKeys="!index ? defaultExpandedKey : []"
            hasCustomNodes
            :key="serviceFolder[0].id"
            nodeKey="id"
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
            :data="binTreeData"
            hasCustomNodes
            nodeKey="id"
            @p-tree-node-clicked="handleBinNodeClick"
            class="bin-tree"
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
import { computed, ref, watch } from 'vue'
import TreeNode from '@/modules/Treeview/components/TreeNode'
import { formatBinData } from './helpers/binHelper'
import type { TreeviewProps, TreeType } from './TreeviewTypes'
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'
import DeleteFolderSection from '@/modules/Treeview/sections/DeleteFolder'
import { PScrollbar, PTree, PLoader } from '@kpmg/styleguide'
import RenameFolderSection from '@/modules/Treeview/sections/RenameFolder'
import { findFolderDeepById } from './helpers/folderArrayHelper'

const props = defineProps<TreeviewProps>()
const emit = defineEmits([
  'selected-folder-change',
  'selected-bin-service-change',
  'open-create-folder-modal',
  'update-source-folders',
  'selected-bin-service-change',
  'remove-folder-from-source',
  'update-folder-name'
])

// This always exists as it is the default structure of any service
const defaultFolder = ref<null | Folder>(null)
const initialSelectedNodeId = computed(() => {
  if (!defaultFolder.value) return
  return defaultFolder.value.id
})

// eslint-disable-next-line vitest/require-hook
watch(() => props.isLoading, () => {
  if (props.isLoading === true) return
  defaultFolder.value = props.servicesFolders[0][0].children[0]
  emit('selected-folder-change', defaultFolder.value)
})

const treeNodeSelectedFolder = ref()

const selectedFolder = computed(():Folder => {
  if (treeNodeSelectedFolder.value) {
    return treeNodeSelectedFolder.value
  }

  return props.selectedFolder || props.servicesFolders[0][0].children[0]
})

const parentNodeOfSelectedFolderTreeNodeAction = ref()

const setParentNodeOfSelectedFolderTreeNodeAction = () => {
  const parentFolderId =
   treeNodeSelectedFolder.value?.parent?.id
  parentNodeOfSelectedFolderTreeNodeAction.value = findFolderDeepById(
    props.servicesFolders[0].filter(f => f.serviceId === props.currentService),
    parentFolderId) as Folder

}
const currentFolderId = ref(0)

const isCreateFolderModalVisible = ref(false)
const isDeleteFolderPopupVisible = ref(false)
const isRenameFolderModalVisible = ref(false)

const currentFolderName = ref(props.selectedFolder ? props.selectedFolder.name : '')

const defaultExpandedKey = computed(() => [props.servicesFolders[0][0].id])

const handleFolderNodeClick = (e: Folder) => {
  const sourceBinTree = retrieveSourceTrees([binTree.value])
  collapseGivenTrees(sourceBinTree)
  treeNodeSelectedFolder.value = e
  emit('selected-folder-change', e)
}

const binTree = ref<TreeType | null>(null)
// I could have use the "props" prop on the Tree that is used to do a property mapping
// But as there's computation in the TreeNode, I need to map it to have a consistent property naming
const binTreeData = computed(() => formatBinData(props.entityServices))

const handleBinNodeClick = (e: Service) => {
  const foldersTrees = retrieveSourceTrees(treesRefs.value)
  collapseGivenTrees(foldersTrees)
  emit('selected-bin-service-change', e.ServiceId)
}

const treesRefs = ref<TreeType[]>([])
const retrieveUnusedTrees = (): TreeType[] => {
  return treesRefs.value.filter(
    (tree) => tree.data[0].serviceId !== props.currentService
  )
}

// Retreiving the source trees allow us to used their internal exposed functions
const retrieveSourceTrees = (
  currentComponentTreeRefs: TreeType[]
): TreeType[] => {
  return currentComponentTreeRefs.map(
    (currentComponentTreeRef) => currentComponentTreeRef.$refs.treeElement
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

// ToolBox scope
const handleToolboxItemChecked = (action: string, folder:Folder) => {
  if (action === 'toolbox-delete-action-click') {
    treeNodeSelectedFolder.value = folder
    isDeleteFolderPopupVisible.value = true
  } else if (action === 'toolbox-rename-action-click') {
    treeNodeSelectedFolder.value = folder
    setParentNodeOfSelectedFolderTreeNodeAction()
    currentFolderName.value = folder?.name
    currentFolderId.value = folder?.id
    isRenameFolderModalVisible.value = true
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
  }
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
