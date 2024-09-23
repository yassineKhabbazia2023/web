<template>
  <div class="folders-breadcrumb">
    <div class="folders-breadcrumb__items">
      <PBreadcrumb
        :pElements="breadCrumbItems"
        @p-breadcrumb-item-click="navigateToFolder"
      />
    </div>
    <div class="folders-breadcrumb__create-folder">
      <PIcon
        class="el-button__icon--left"
        @click="handleCreateFolderButtonClick"
      >
        <PIFolderPlus />
      </PIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PBreadcrumb, PIFolderPlus, PIcon } from '@kpmg/styleguide'
import { computed } from 'vue'
import type {
  FoldersBreadCrumbProps,
} from './FoldersBreadCrumbTypes'
import type { Folder } from '@ged/models/Folder'
import { findFolderDeepById } from '@ged/modules/Treeview/helpers/folderArrayHelper'
import type { BreadcrumbItems }
  from '@kpmg/styleguide'
const props = defineProps<FoldersBreadCrumbProps>()
const emit = defineEmits(['navigate-to-folder', 'open-create-folder-modal'])
const breadCrumbItems = computed(() => generateBreadCrumb())

const navigateToFolder = (folderId: Folder['id']) => {
  const folder = findFolderDeepById(props.currentServiceFolder, folderId)
  emit('navigate-to-folder', folder)
}

const generateBreadCrumb = (): BreadcrumbItems[] => {
  const items: BreadcrumbItems[] = []
  let targetFolder: Folder | undefined = props.currentFolder
  items.push({
    pId: targetFolder.id,
    pText: targetFolder.name,
  })
  if (targetFolder && targetFolder.id && targetFolder.parent) {
    while (targetFolder && targetFolder.parent.id !== 0) {
      const parentFolder = findFolderDeepById(
        props.currentServiceFolder,
        targetFolder?.parent.id ?? null,
      )

      targetFolder = parentFolder
      if (targetFolder) {
        items.push({
          pId: targetFolder.id,
          pText: targetFolder.name,
        })
      }
    }
  }

  // To ensure accurate sorting by document ID,
  // we convert the document IDs from strings to numbers before performing the sort operation.
  // This is necessary because the sort function expects numerical values for the sorting criterion.
  return items.sort((a, b) => Number(a.pId) - Number(b.pId))
}

const handleCreateFolderButtonClick = () => {
  emit('open-create-folder-modal')
}
</script>

<style lang="scss">
.folders-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  flex-wrap: nowrap;

  &__items {
    overflow: hidden;
  }

  &__create-folder {
    height: 16px;
    width: 16px;
    margin-left: 1.6rem;
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
  }
  .el-breadcrumb__item {
    float: none;
  }
}
</style>
