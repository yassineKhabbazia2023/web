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
        numberOfSelectedDocuments
      )
    "
    :canCloseModal="canCloseModal"
    @close-modal="handleClose"
    @navigate-to-folder="handleExplorerNavigation"
    @update-source-folders="propagateUpdateSourceFolders"
    @modal-action-clicked="handleMoveDocumentClicked"
  />
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import DocumentModalExplorer from '../DocumentsExplorerModal'
import type {
  DocumentMoveProps,
  ExplorerMoveDocument,
  MoveDocumentsRequest,
} from './DocumentsMoveTypes'
import type { Folder } from '@ged/models/Folder'
import { useI18n } from 'vue-i18n'
import { generateActionsForModal } from '../DocumentsExplorerModal/helpers/ModalsActionsHelpers'
import { modalButtonsMove } from './helpers/MoveModalActionsHelpers'
import { moveDocuments } from '@ged/services/Documents'
import { mapExplorerDocumentFromDocuments } from '../../helpers/documentExplorerMapper'
import { PNotification } from '@pulse/styleguide'
import type { ExplorerDocument } from '../../DocumentsTypes'
import { trackDocumentMove } from '@ged/services/tracking/tracking.service'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentMoveProps>()
const emit = defineEmits([
  'update:modelValue',
  'update-source-folders',
  'close-move-documents-modal',
  'refresh-documents-list',
])

const currentExplorerFolder = ref<Folder>(props.folder)
const modalActionsButtons = ref(
  generateActionsForModal(
    ['CAN_MOVE_DOCUMENT', 'CANCEL_MOVE_DOCUMENT'],
    modalButtonsMove,
  ),
)

watch(
  () => props.isMoveModalOpened,
  () => {
    modalActionsButtons.value.filter(
      (d) => d.buttonActionName === 'modal-move-document-action-click',
    )[0].disabled = false
    if (!explorerDocuments.value.some((d) => d.givenActionState === 'TO_DO')) {
      modalActionsButtons.value.filter(
        (d) => d.buttonActionName === 'modal-move-document-action-click',
      )[0].disabled = true
    }
  },
  { deep: true },
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
    actionName: 'modal-move-document-action-click',
    isActionAuthorized: currentExplorerFolder.value.permissions.includes('CAN_MOVE_INTO_FOLDER'),
  }
},
)
const explorerDocumentsForMoveFlow = computed(() => explorerDocuments)
// Creating explorer documents
const explorerDocuments = ref<ExplorerMoveDocument[]>(
  mapExplorerDocumentFromDocuments(props.selectedDocuments),
)

watch(
  [() => props.selectedDocuments, isDocumentExplorerModalOpened],
  () => {
    explorerDocuments.value = mapExplorerDocumentFromDocuments(
      props.selectedDocuments,
    )
  },
  { deep: true },
)

const numberOfSelectedDocuments = computed(() => {
  return explorerDocuments.value.filter(
    (document: ExplorerDocument) =>
      (
        document.givenActionState !== 'ERROR' &&
        document.givenActionState !== 'FAILED' &&
        (document.isSelected || document.givenActionState === 'IN_PROGRESS')
      ),
  ).length
})

// folders navigation management
const handleExplorerNavigation = (folder: Folder) => {
  currentExplorerFolder.value = folder
}

const propagateUpdateSourceFolders = (createdFolder: Folder) => {
  emit('update-source-folders', createdFolder)
}

const handleMoveDocumentClicked = async (action: string) => {
  if (action === 'modal-move-document-action-click') {
    modalActionsButtons.value = generateActionsForModal(
      ['MOVE_IN_PROGRESS'],
      modalButtonsMove,
    )
    const selectedDocuments =
      explorerDocuments.value.filter((d) => d.isSelected && d.givenActionState !== 'ERROR') || []
    selectedDocuments.forEach((d) => {
      d.givenActionState = 'IN_PROGRESS'
    })
    await proceedMoveDocuments(selectedDocuments)

    const shouldCloseModal = !explorerDocuments.value.some(
      (document: ExplorerDocument) =>
        document.givenActionState === 'TO_DO' ||
        document.givenActionState === 'FAILED' ||
        document.givenActionState === 'IN_PROGRESS',
    )

    if (shouldCloseModal) {
      handleClose()
    }
  }

  if (action === 'modal-cancel-document-action-click') {
    handleClose()
  }
}

async function proceedMoveDocuments(documents: ExplorerMoveDocument[]) {
  const destinationFolder = { ...currentExplorerFolder.value }
  try {
    const moveDocumentRequest: MoveDocumentsRequest = {
      ids: documents.map((d) => d.id),
      sourceFolderId: props.folder.id,
      destinationFolderId: destinationFolder.id,
      moveAll: false,
      serviceId: props.selectedEntity,
    }
    await moveDocuments(
      props.currentService,
      props.selectedEntity,
      moveDocumentRequest,
    )
    documents.forEach((d) => {
      d.givenActionState = 'DONE'
    })
    triggerSuccessNotification(documents.length, destinationFolder.name)
    trackDocumentMove({ isMoveSuccessful: true })
  } catch (error: any) {
    documents.forEach((d) => {
      d.codeError = error?.response?.status
      d.givenActionState = d.codeError === '500' ? 'ERROR' : 'FAILED'
    })
    trackDocumentMove({ isMoveSuccessful: false })
  }

  if (!explorerDocuments.value.some((d) => d.givenActionState === 'TO_DO')) {
    modalActionsButtons.value = generateActionsForModal(
      ['CAN_MOVE_DOCUMENT', 'CANCEL_MOVE_DOCUMENT'],
      modalButtonsMove,
    )
    modalActionsButtons.value.filter(
      (d) => d.buttonActionName === 'modal-move-document-action-click',
    )[0].disabled = true
  } else {
    modalActionsButtons.value = generateActionsForModal(
      ['CAN_MOVE_DOCUMENT', 'CANCEL_MOVE_DOCUMENT'],
      modalButtonsMove,
    )
  }
}

watch(
  () => props.folder,
  (folder) => {
    currentExplorerFolder.value = folder
  },
)

// Main modal actions
const handleClose = () => {
  if (explorerDocuments.value.some((d) => d.givenActionState === 'DONE')) {
    emit('refresh-documents-list')
  }
  explorerDocuments.value.length = 0
  modalActionsButtons.value.filter(
    (d) => d.buttonActionName === 'modal-move-document-action-click',
  )[0].disabled = false
  currentExplorerFolder.value = props.folder
  emit('close-move-documents-modal')
}

const canCloseModal = computed(() =>
  !explorerDocuments.value.some(doc => doc.givenActionState === 'IN_PROGRESS'))

// Notifications Scope
const triggerSuccessNotification = (
  documentsCount: number,
  folderName: string,
) => {
  PNotification({
    message:
      documentsCount > 1
        ? t('notifications.successMsg.plural', {
          documentCount: documentsCount,
          folderName,
        })
        : t('notifications.successMsg.single', { folderName }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}
</script>

<!-- eslint-disable max-len -->
<i18n lang="json">
{
  "en-US": {
    "modalTitle": "Déplacer 0 document dans {folderName} | Déplacer 1 document dans {folderName} | Déplacer {count} documents dans {folderName}",
    "folderList": {
      "explorerUnauthorizedGivenActionMessage": "Vous n'êtes pas autorisé à déplacer dans ce dossier",
      "foldersListEmptyFolderLabel": "There is no subfolder"
    },
    "documentsList": {
      "noMovableDocumentsLabel": "Aucun document ne peut être déplacé dans votre espace documentaire."
    },
    "notifications": {
      "successMsg": {
        "plural": "Les {documentCount} documents ont été déplacés dans le dossier {folderName}",
        "single": "1 document a été déplacé dans le dossier {folderName}"
      }
    },
    "header": {
      "title": "Certains documents ne peuvent pas être déplacés dans votre espace documentaire"
    }
  },
  "fr-FR": {
    "modalTitle": "Déplacer 0 document dans {folderName} | Déplacer 1 document dans {folderName} | Déplacer {count} documents dans {folderName}",
    "folderList": {
      "explorerUnauthorizedGivenActionMessage": "Vous n'êtes pas autorisé à déplacer dans ce dossier",
      "foldersListEmptyFolderLabel": "Aucun sous-dossier"
    },
    "documentsList": {
      "noMovableDocumentsLabel": "Aucun document ne peut être déplacé dans votre espace documentaire."
    },
    "notifications": {
      "successMsg": {
        "plural": "Les {documentCount} documents ont été déplacés dans le dossier {folderName}",
        "single": "1 document a été déplacé dans le dossier {folderName}"
      }
    },
    "header": {
      "title": "Certains documents ne peuvent pas être déplacés dans votre espace documentaire"
    }
  }
}
</i18n>
