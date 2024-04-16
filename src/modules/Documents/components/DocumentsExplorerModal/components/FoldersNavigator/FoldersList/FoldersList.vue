<template>
  <div
    class="folder-list"
    :class="{ 'folder-list--no-children-folder': !doesCurrentFolderContainsChildren }"
  >
    <div
      v-if="!explorerAuthorizedGivenAction"
      class="folder-list__notification-wrapper padding-x--2 margin-bottom--1"
    >
      <PAlert
        class="folder-list__notification"
        type="danger"
        data-testid="ged-unauthorized-given-action-alert"
      >
        {{ explorerUnauthorizedGivenActionMessage }}
      </PAlert>
    </div>

    <PFolderLineNavigationItem
      v-for="folder in currentFolder.children"
      :key="folder.id"
      :pFolderName="folder.name"
      :pFolderId="folder.id"
      :pHasArrow="folder.children.length !== 0"
      :pLeftIcon="getIconMapping(folder.iconName)"
      :pDisabled="isFolderLineDisabled(folder.id)"
      :pSelected="false"
      @click="navigateToFolder(folder.id)"
    />

    <div
      class="folder-list__empty-folder"
      v-if="!doesCurrentFolderContainsChildren"
    >
      <PImage
        class="folder-list__empty-folder__badge"
        pType="badges"
        pName="folder"
      />
      <p class="folder-list__empty-folder__label">
        {{ foldersListEmptyFolderLabel }}
      </p>
    </div>
  </div>

  <CreateFolderSection
    :serviceId="currentService"
    :entityId="selectedEntity"
    :selectedFolder="currentFolder"
    :isCreateFolderModalVisible="isCreateFolderModalVisible"
    :hasCreateFolderButton="false"
    isCreateFolderModalCentered
    @update-source-folders="propagateUpdateSourceFolders"
    @on-close-create-folder="handleCloseCreateFolderModal"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  PAlert,
  PFolderLineNavigationItem,
  PImage,
} from '@kpmg/styleguide'
import type { FoldersListProps } from './FoldersListTypes'
import { findFolderDeepById } from '@/modules/Treeview/helpers/folderArrayHelper'
import type { Folder } from '@/models/Folder'
import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'

const props = defineProps<FoldersListProps>()
const emit = defineEmits([
  'navigate-to-folder',
  'close-create-folder-modal',
  'update-source-folders',
])

const getIconMapping = (iconName: string | undefined) => {
  switch (iconName) {
    case 'accountingRoot':
      return 'PICalculatorEuro'
    case 'socialRoot':
      return 'PIPersonVcard'
    case 'deposit':
      return 'PIInbox'
    case 'reservedKpmg':
      return 'PIKpmg'
    case 'binIcon':
      return 'PITrash'
    default:
      return 'PIFolder'
  }
}

const isFolderLineDisabled = (folderLineFolderId: Folder['id']) => {
  if (props.explorerFolderListLineDisabledState) {
    switch (props.explorerFolderListLineDisabledState.context) {
      case 'MOVE_FOLDER':
        return isFolderLineDisabledBasedOnMoveFolderContext(folderLineFolderId)
      default:
        return false
    }
  }
  return false
}

const isFolderLineDisabledBasedOnMoveFolderContext = (folderLineFolderId: Folder['id']) => {
  if (props.explorerFolderListLineDisabledState) {
    return props.explorerFolderListLineDisabledState.data === folderLineFolderId
  }
}

const navigateToFolder = (folderId: Folder['id']) => {
  const folder = findFolderDeepById(props.currentServiceFolder, folderId)
  emit('navigate-to-folder', folder)
}

const doesCurrentFolderContainsChildren = computed(() => props.currentFolder.children.length)

const handleCloseCreateFolderModal = () => {
  emit('close-create-folder-modal')
}

const propagateUpdateSourceFolders = (createdFolder: Folder) => {
  emit('update-source-folders', createdFolder)
}

</script>

<style lang="scss">

.folder-list {
  &--no-children-folder {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  &__notification-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__notification {
    width: 100%;
  }

  &__empty-folder {
    min-height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translateY(-51%);
    margin-top: auto;
    margin-bottom: auto;

    &__badge {
      width: 75px;
      height: 80px;
      margin-bottom: 4px;
    }

    &__label {
      color: var(--el-color-neutral-gray-500);
      text-align: center;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
    }
  }
}
</style>
