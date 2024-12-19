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
      :pIconLeftName="getIconMapping(folder.iconName)"
      :pDisabled="isFolderLineDisabled(folder.id)"
      :pSelected="false"
      :pTooltipContent="getTooltipContent(folder.id)"
      @click="navigateToFolder(folder.id)"
    />

    <div
      v-if="!doesCurrentFolderContainsChildren"
      class="folder-list__empty-folder"
      data-test-id="folders-list-empty-folder-label"
    >
      <div class="folder-list__no-subfolder-image">
        <PImage pName="empty-subfolder" />
      </div>

      <p class="folder-list__empty-folder__label margin-top--2">
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
import { useI18n } from 'vue-i18n'
import { PAlert, PFolderLineNavigationItem, PImage } from '@pulse/styleguide/components'
import type { FoldersListProps } from './FoldersListTypes'
import { findFolderDeepById } from '@ged/modules/Treeview/helpers/folderArrayHelper'
import type { Folder } from '@ged/models/Folder'
import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'
import { type IconName } from '@pulse/styleguide/types'

const props = defineProps<FoldersListProps>()
const emit = defineEmits([
  'navigate-to-folder',
  'close-create-folder-modal',
  'update-source-folders',
])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const getIconMapping = (iconName: string | undefined): IconName => {
  switch (iconName) {
  case 'accountingRoot':
    return 'calculatorEuro'
  case 'socialRoot':
    return 'personVcard'
  case 'deposit':
    return 'inbox'
  case 'reservedKpmg':
    return 'shieldLock'
  case 'binIcon':
    return 'trash'
  default:
    return 'folder'
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

function getTooltipContent(folderId: Folder['id']) {
  return isFolderLineDisabled(folderId) ? t('cantMoveToSameFolder') : ''
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

  &__no-subfolder-image {
    width: 80px;
  }
}
</style>

<i18n lang="yaml">
en-US:
  cantMoveToSameFolder: "You can't move into the folder you are currently moving."
fr-FR:
  cantMoveToSameFolder: 'Vous ne pouvez pas déplacer dans le dossier en cours de déplacement'
</i18n>
