<template>
  <DocumentModalExplorer
    v-model="isDocumentExplorerModalOpened"
    :currentFolder="currentExplorerFolder"
    :currentServiceFolder="currentServiceFolder"
    :ExplorerAuthorizedGivenAction="isMoveAuthorized"
    :currentService="currentService"
    :selectedEntity="selectedEntity"
    :documentsSelectorEmptyDocumentsListLabel="
      t('documentsList.noMovableDocumentsLabel')
    "
    :explorerUnauthorizedGivenActionMessage="
      t('folderList.explorerUnauthorizedGivenActionMessage')
    "
    :foldersListEmptyFolderLabel="t('folderList.foldersListEmptyFolderLabel')"
    :documents="explorerDocumentsForMoveFlow.value"
    :modalActionsButtonsList="modalActionsButtons"
    :headerTitle="t('header.title')"
    :modalTitle="
      t(
        'modalTitle',
        { folderName: currentExplorerFolder.name },
        numberOfSelectedFolders
      )
    "
    :explorerFolderListLineDisabledState="explorerFolderListLineDisabledState"
    isFolderLine
    :canCloseModal="canCloseModal"
    @close-modal="handleClose"
    @navigate-to-folder="handleExplorerNavigation"
    @update-source-folders="propagateUpdateSourceFolders"
    @modal-action-clicked="handleMoveDocumentClicked"
  />
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { computed, ref, watch } from 'vue'
import DocumentModalExplorer from '@ged/modules/Documents/components/DocumentsExplorerModal'
import type { FoldersMoveProps, ExplorerMoveFolder } from './FoldersMoveTypes'
import type { Folder } from '@ged/models/Folder'
import { useI18n } from 'vue-i18n'
import { generateActionsForModal } from
  '@ged/modules/Documents/components/DocumentsExplorerModal/helpers/ModalsActionsHelpers'
import { modalButtonsMove } from './helpers/MoveModalActionsHelpers'
import { mapExplorerDocumentFromFolders } from '@ged/modules/Documents/helpers/documentExplorerMapper'
import { PNotification } from '@pulse/styleguide'
import type { ExplorerDocument, ExplorerFoldersListLineDisabledState } from '@ged/modules/Documents/DocumentsTypes'
import { moveFolderAsync } from '@ged/services/Folder'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<FoldersMoveProps>()

const emit = defineEmits([
  'update:modelValue',
  'update-source-folders',
  'close-move-folder-modal',
  'refresh-tree',
])

const currentExplorerFolder = ref<Folder>(props.folder)

const explorerFolderListLineDisabledState = ref<ExplorerFoldersListLineDisabledState>({
  data: props.folderToMove.id,
  context: 'MOVE_FOLDER',
})

const modalActionsButtons = ref(
  generateActionsForModal(
    ['CAN_MOVE_FOLDER', 'CANCEL_MOVE_FOLDER'],
    modalButtonsMove,
  ),
)

const isDocumentExplorerModalOpened = computed({
  get() {
    return props.isMoveModalOpened
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const isMoveAuthorized = computed(() => {
  return {
    actionName: 'modal-move-folder-action-click',
    isActionAuthorized: currentExplorerFolder.value.permissions.includes(
      'CAN_MOVE_INTO_FOLDER',
    ),
  }
})

const explorerDocumentsForMoveFlow = computed(() => explorerDocuments)

// Creating explorer documents
const explorerDocuments = ref<ExplorerMoveFolder[]>(
  mapExplorerDocumentFromFolders(props.folderToMove),
)

watch(
  () => props.folderToMove,
  () => {
    explorerDocuments.value = mapExplorerDocumentFromFolders(props.folderToMove)
    explorerFolderListLineDisabledState.value = {
      data: props.folderToMove.id,
      context: 'MOVE_FOLDER',
    }
  },
  { deep: true },
)

const numberOfSelectedFolders = computed(() => {
  return explorerDocuments.value.filter(
    (document: ExplorerDocument) =>
      document.givenActionState !== 'ERROR' &&
      document.givenActionState !== 'FAILED' &&
      (document.isSelected || document.givenActionState === 'IN_PROGRESS'),
  ).length
})

// folders navigation management
const handleExplorerNavigation = (folder: Folder) => {
  currentExplorerFolder.value = folder
}

const propagateUpdateSourceFolders = (createdFolder: Folder) => {
  emit('update-source-folders', createdFolder)
}

watch(
  () => props.folder,
  (folder) => {
    currentExplorerFolder.value = folder
  },
)

// Main modal actions

const resetButtonsState = () => {
  modalActionsButtons.value = generateActionsForModal(
    ['CAN_MOVE_FOLDER', 'CANCEL_MOVE_FOLDER'],
    modalButtonsMove,
  )

  modalActionsButtons.value.filter(
    (d) => d.buttonActionName === 'modal-move-folder-action-click',
  )[0].disabled = false
}

const handleClose = () => {
  // setTimeout to have a better visual flow
  setTimeout(() => {
    if (explorerDocuments.value[0].givenActionState !== 'IN_PROGRESS') {
      resetButtonsState()

      currentExplorerFolder.value = props.folder
      emit('close-move-folder-modal')
    }
  }, 500)
}

const moveFolder = async () => {
  try {
    modalActionsButtons.value = generateActionsForModal(
      ['MOVE_IN_PROGRESS'],
      modalButtonsMove,
    )

    explorerDocuments.value[0].givenActionState = 'IN_PROGRESS'

    await moveFolderAsync(
      props.currentService,
      props.selectedEntity,
      props.folderToMove.id,
      currentExplorerFolder.value.id,
    )

    explorerDocuments.value[0].givenActionState = 'DONE'
    emit('refresh-tree', props.folderToMove.id)

    handleClose()

    triggerSuccessNotification(props.folderToMove.name, currentExplorerFolder.value.name)
  } catch (error) {
    logger.error(error)
    explorerDocuments.value[0].givenActionState = 'FAILED'

    handleClose()

    triggerFailureNotification()
  }
}

const handleMoveDocumentClicked = async (action: string) => {
  if (action === 'modal-move-folder-action-click') {
    await moveFolder()
  }
  if (action === 'modal-cancel-folder-action-click') {
    handleClose()
  }
}

const canCloseModal = computed(() =>
  !explorerDocuments.value.some(doc => doc.givenActionState === 'IN_PROGRESS'))

// // Notifications Scope
const triggerSuccessNotification = (
  movedFolderName: string,
  targetFolderName: string,
) => {
  PNotification({
    message: t('notifications.successMsg', { movedFolderName, targetFolderName }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const triggerFailureNotification = (
) => {
  PNotification({
    message: t('notifications.failureMsg'),
    iconName: 'exclamationTriangle',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}
</script>

<!-- eslint-disable max-len -->
<i18n lang="json">
{
  "en-US": {
    "modalTitle": "Déplacer 0 dossier dans {folderName} | Déplacer 1 dossier dans {folderName} | Déplacer {count} dossiers dans {folderName}",
    "folderList": {
      "explorerUnauthorizedGivenActionMessage": "Vous n'êtes pas autorisé à déposer dans ce dossier. Sélectionnez un des dossiers ci-dessous",
      "foldersListEmptyFolderLabel": "There is no subfolder"
    },
    "documentsList": {
      "noMovableDocumentsLabel": "Aucun dossier ne peut être déplacé dans votre espace documentaire."
    },
    "header": {
      "title": "Certains dossiers ne peuvent pas être déplacés dans votre espace documentaire"
    },
    "notifications": {
      "successMsg": "Le dossier { movedFolderName } a été déplacé dans le dossier { targetFolderName }",
      "failureMsg": "Connexion au serveur interrompue"
    }
  },
  "fr-FR": {
    "modalTitle": "Déplacer 0 dossier dans {folderName} | Déplacer 1 dossier dans {folderName} | Déplacer {count} dossiers dans {folderName}",
    "folderList": {
      "explorerUnauthorizedGivenActionMessage": "Vous n'êtes pas autorisé à déposer dans ce dossier. Sélectionnez un des dossiers ci-dessous",
      "foldersListEmptyFolderLabel": "Aucun sous-dossier"
    },
    "documentsList": {
      "noMovableDocumentsLabel": "Aucun dossier ne peut être déplacé dans votre espace documentaire."
    },
    "header": {
      "title": "Certains dossiers ne peuvent pas être déplacés dans votre espace documentaire"
    },
    "notifications": {
      "successMsg": "Le dossier {movedFolderName} a été déplacé dans le dossier {targetFolderName}",
      "failureMsg": "Connexion au serveur interrompue"
    }
  }
}
</i18n>
