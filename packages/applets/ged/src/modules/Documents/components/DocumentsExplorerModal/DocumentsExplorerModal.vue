<template>
  <PDialog
    v-model="isDialogVisible"
    :title="modalTitle"
    :beforeClose="handleCloseModal"
    pDestroyOnClose
    class="documents-explorer-modal"
  >
    <DocumentsExplorerHeader
      v-if="deferHeaderLoadingWorkaround && failedDocuments && failedDocuments.length"
      :documents="explorerDocuments"
      :headerTitle="headerTitle"
    />
    <div class="documents-explorer-modal__explorer">
      <div class="documents-explorer-modal__explorer__left-section">
        <div class="documents-explorer-modal__explorer__left-section__header">
          <DocumentsCheckAll
            :checked="isAllDocumentsChecked"
            :disabled="false"
            @check-all-documents="handleCheckAll"
          />
        </div>
        <div class="documents-explorer-modal__explorer__left-section__content">
          <PScrollbar viewStyle="margin-right: 8px; height: 100%;">
            <DocumentsList
              :documents="explorerDocuments"
              :documentsSelectorEmptyDocumentsListLabel="documentsSelectorEmptyDocumentsListLabel"
              :isFolderLine="isFolderLine"
            />
          </PScrollbar>
        </div>
      </div>
      <div class="documents-explorer-modal__explorer__right-section">
        <div class="documents-explorer-modal__explorer__right-section__header">
          <FoldersBreadCrumb
            :currentFolder="currentFolder"
            :currentServiceFolder="currentServiceFolder"
            @navigate-to-folder="handleFolderNavigation"
            @open-create-folder-modal="handleOpenCreateFolderModal"
          />
        </div>
        <div class="documents-explorer-modal__explorer__right-section__content">
          <PScrollbar viewStyle="height: 100%;">
            <FoldersList
              :currentFolder="currentFolder"
              :currentServiceFolder="currentServiceFolder"
              :explorerAuthorizedGivenAction="ExplorerAuthorizedGivenAction.isActionAuthorized"
              :currentService="currentService"
              :selectedEntity="selectedEntity"
              :accountId="accountId"
              :isCreateFolderModalVisible="isCreateFolderModalVisible"
              :explorerUnauthorizedGivenActionMessage="explorerUnauthorizedGivenActionMessage"
              :foldersListEmptyFolderLabel="foldersListEmptyFolderLabel"
              :explorerFolderListLineDisabledState="explorerFolderListLineDisabledState"
              @navigate-to-folder="handleFolderNavigation"
              @update-source-folders="propagateUpdateSourceFolders"
              @close-create-folder-modal="handleCloseCreateFolderModal"
            />
          </PScrollbar>
        </div>
      </div>
    </div>
    <template #footer>
      <DocumentsModalActionsFooter
        :modalActionsButtons="mappedButtonsList"
        @modal-action-button-clicked="handleActionButtonClicked"
      />
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { PDialog, PScrollbar } from '@pulse/styleguide/components'
import type { DocumentsModalExplorerProps } from './DocumentsExplorerModalTypes'
import DocumentsExplorerHeader from './components/DocumentsExplorerHeader'
import DocumentsCheckAll from './components/DocumentsSelector/DocumentsCheckAll'
import FoldersList from './components/FoldersNavigator/FoldersList'
import FoldersBreadCrumb from './components/FoldersNavigator/FoldersBreadCrumb'
import DocumentsList from './components/DocumentsSelector/DocumentsList'
import DocumentsModalActionsFooter from './components/DocumentsModalActionsFooter'
import type { Folder } from '@ged/models/Folder'
import type { ExplorerDocument } from '../../DocumentsTypes'
import { deepCopy } from '@ged/modules/common/utils/deepCopy'
import type { ButtonAction } from '@ged/modules/common/Types/ButtonAction'

const props = defineProps<DocumentsModalExplorerProps>()

const emit = defineEmits([
  'update:isDialogVisible',
  'navigate-to-folder',
  'update-source-folders',
  'modal-action-clicked',
  'close-modal',
])

const isDialogVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:isDialogVisible', value)
  },
})

const isCreateFolderModalVisible = ref(false)

const explorerDocuments = ref<ExplorerDocument[]>(props.documents)

const isAllDocumentsChecked = computed(() => {
  const toDoExplorerDocuments =
    explorerDocuments.value.filter((e) => e.givenActionState === 'TO_DO')
  const toDoAndSelectedExplorerDocuments = explorerDocuments.value
    .filter(doc => doc.isSelected === true && doc.givenActionState === 'TO_DO')
  if (toDoExplorerDocuments.length === 0 && toDoAndSelectedExplorerDocuments.length === 0) {
    return false
  }
  return toDoExplorerDocuments.length === toDoAndSelectedExplorerDocuments.length
})

const failedDocuments = computed(() =>
  explorerDocuments.value
    .filter(doc => doc.givenActionState === 'ERROR')
    .map(doc => ({ name: doc.content.name, codeError: doc.codeError })),
)

const buttonsList = ref<ButtonAction[]>(deepCopy(props.modalActionsButtonsList))

watch(
  () => props.modalActionsButtonsList,
  () => {
    buttonsList.value = props.modalActionsButtonsList
  },
)
const mappedButtonsList = computed(() => {
  if (!props.ExplorerAuthorizedGivenAction.isActionAuthorized) {
    buttonsList.value.forEach((button: ButtonAction) => {
      if (button.buttonActionName === props.ExplorerAuthorizedGivenAction.actionName) {
        button.disabled = true
      }
    })

    return buttonsList.value
  }

  if (!explorerDocuments.value.some((d) => d.isSelected)) {
    buttonsList.value.forEach((button: ButtonAction) => {
      if (button.buttonActionName === props.ExplorerAuthorizedGivenAction.actionName) {
        button.disabled = true
      }
    })

    return buttonsList.value
  }

  buttonsList.value.forEach((button: ButtonAction) => {
    if (button.buttonActionName === props.ExplorerAuthorizedGivenAction.actionName) {
      button.disabled = false
    }
  })

  return buttonsList.value
})

const handleFolderNavigation = (folder: Folder) => {
  emit('navigate-to-folder', folder)
}

const handleOpenCreateFolderModal = () => {
  isCreateFolderModalVisible.value = true
}

const handleCloseCreateFolderModal = () => {
  isCreateFolderModalVisible.value = false
}

const propagateUpdateSourceFolders = (createdFolder: Folder) => {
  emit('update-source-folders', createdFolder)
}

const handleCheckAll = (value: boolean) => {
  explorerDocuments.value.map((document) => {
    if (document.givenActionState === 'TO_DO') {
      document.isSelected = value
      return document
    } else {
      return document
    }
  })
}

watch(
  () => props.documents,
  (newValue) => {
    explorerDocuments.value = newValue
  },
)

const handleActionButtonClicked = (action: string) => {
  emit('modal-action-clicked', action)
}

const handleCloseModal = (done: () => void) => {
  if (props.canCloseModal) {
    done()
    emit('close-modal')
  }
}

/* This is used because for some reasons
Loading it at the same time as the other component make is buggy and crashes the app
This is probably due to everything being async components.
*/
const deferHeaderLoadingWorkaround = ref(false)
onMounted(() => {
  setTimeout(() => {
    deferHeaderLoadingWorkaround.value = true
  }, 4000)
})

</script>

<style lang="scss">
@use '@ged/utils/breakpoints';
.documents-explorer-modal {
  margin-top: 13vh;

  @include breakpoints.media(lg) {
    width: 65%;
  }

  @include breakpoints.media(md3) {
    width: 70%;
    margin-top: 8vh;
  }

  @include breakpoints.media(md) {
    width: 95%;
    margin-top: 5vh;
  }

  &__explorer {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid var(--el-color-neutral-gray-100);
    border-radius: var(--el-border-radius-small);
    height: 475px;
    margin-top: 16px;

    &__left-section,
    &__right-section {
      &__header {
        border-bottom: 1px solid var(--el-color-neutral-gray-100);
        padding: 0 16px;
        height: 44px; //based on check-all height from styleguide
      }

      &__content {
        height: calc(475px - 42px);
      }
    }

    &__left-section {
      width: 36%;
      border-right: 1px solid var(--el-color-neutral-gray-100);
      height: 100%;

      &__content {
        padding: 4px;
        padding-bottom: 8px;
        padding-right: 0;
      }
    }

    &__right-section {
      width: 64%;
      height: 100%;

      &__content {
        width: 100%;
        padding: 4px 0;
      }
    }
  }
}
</style>
