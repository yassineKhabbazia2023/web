<template>
  <div class="folders-breadcrumb">
    <div class="folders-breadcrumb__items">
      <PBreadcrumb
        :pElements="breadCrumbItems"
        @p-breadcrumb-item-click="navigateToFolder"
      />
    </div>
    <div
      class="
        folders-breadcrumb__create-folder
        flex
        flex--align-items-center
        font-semibold
        font-small
      "
      @click="handleCreateFolderButtonClick"
    >
      <PIcon
        class="el-button__icon--left"
        pName="folderPlus"
        pSize="16"
      />
      <span>{{ t('newFolder') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PBreadcrumb, PIcon } from '@pulse/styleguide/components'
import { computed } from 'vue'
import type {
  FoldersBreadCrumbProps,
} from './FoldersBreadCrumbTypes'
import type { Folder } from '@ged/models/Folder'
import { findFolderDeepById } from '@ged/modules/Treeview/helpers/folderArrayHelper'
import type { BreadcrumbItems } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

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
    gap: 8px;
    margin-left: 1.6rem;
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;

    span {
      transition: color 100ms ease-in;
    }
    &:hover {
      color: var(--el-color-persian-400);
    }
  }
  .el-breadcrumb__item {
    float: none;
  }
}
</style>

<i18n lang="yaml">
en-US:
  newFolder: 'Create folder'
fr-FR:
  newFolder: 'Nouveau dossier'
</i18n>
