<template>
  <DocumentModalExplorer
    v-model="isDocumentExplorerModalOpened"
    :currentFolder="currentExplorerFolder"
    :currentServiceFolder="currentServiceFolder"
    :ExplorerAuthorizedGivenAction="isUploadAuthorized"
    :currentService="currentService"
    :selectedEntity="selectedEntity"
    :documentsSelectorEmptyDocumentsListLabel="t('documentsList.noDeposableDocumentsLabel')"
    :explorerUnauthorizedGivenActionMessage="t('folderList.explorerUnauthorizedGivenActionMessage')"
    :foldersListEmptyFolderLabel="t('folderList.foldersListEmptyFolderLabel')"
    :documents="explorerDocumentsForUploadFlow"
    :modalActionsButtonsList="modalActionsbuttons"
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
    @modal-action-clicked="handleUploadDocumentClicked"
  />
</template>

<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import DocumentModalExplorer from '../DocumentsExplorerModal'
import type { DocumentUploadProps, ExplorerUploadDocument } from './DocumentsUploadTypes'
import type { Folder } from '@ged/models/Folder'
import { useI18n } from 'vue-i18n'
import { generateActionsForModal } from '../DocumentsExplorerModal/helpers/ModalsActionsHelpers'
import { modalButtonsUpload } from './helpers/ModalUploadActionsHelpers'
import { uploadDocument } from '@ged/services/Documents'
import { mapExplorerDocumentFromFiles } from '../../helpers/documentExplorerMapper'

import type { ToastPluginFunc } from '@ged/modules/common/Types/toastPluginTypes'
import { PICheck } from '@pulse/styleguide/components'
import type { ExplorerDocument } from '../../DocumentsTypes'
import { trackDepositedDocument } from '@ged/services/tracking/tracking.service'

const toastPlugin = inject('toast') as unknown as ToastPluginFunc

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentUploadProps>()
const emit = defineEmits([
  'update:modelValue',
  'update-source-folders',
  'close-upload-documents-modal',
  'update-document-list-upload',
  'refresh-documents-list',
])

const currentExplorerFolder = ref<Folder>(props.folder)
const modalActionsbuttons =
  ref(generateActionsForModal(['CAN_ADD_DOCUMENT', 'CANCEL_ADD_DOCUMENT'], modalButtonsUpload))

watch(
  () => props.isUploadModalOpened,
  () => {
    modalActionsbuttons.value.filter(d => d.buttonActionName ===
      'modal-add-document-action-click')[0].disabled = false
    if (!explorerDocuments.value.some(d => d.givenActionState === 'TO_DO')) {
      modalActionsbuttons.value.filter(d => d.buttonActionName ===
      'modal-add-document-action-click')[0].disabled = true
    }
  }, { deep: true },
)
const isDocumentExplorerModalOpened = computed({
  get() {
    return props.isUploadModalOpened
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const isUploadAuthorized = computed(() => {
  return {
    actionName: 'modal-add-document-action-click',
    isActionAuthorized: currentExplorerFolder.value.permissions.includes('CAN_UPLOAD_FILES'),
  }
},
)
const explorerDocumentsForUploadFlow = computed(() => explorerDocuments.value)
// Creating explorer documents
const explorerDocuments = ref<ExplorerUploadDocument[]>(mapExplorerDocumentFromFiles(props.files))

watch(
  () => props.files,
  () => {
    explorerDocuments.value = mapExplorerDocumentFromFiles(props.files)
  }, { deep: true },
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

const handleUploadDocumentClicked = async (action: string) => {
  if (action === 'modal-add-document-action-click') {
    modalActionsbuttons.value = generateActionsForModal(['DEPOT_IN_PROGRESS'], modalButtonsUpload)
    const selectedDocuments = explorerDocuments.value.filter(d => d.isSelected) || []
    selectedDocuments.forEach((d) => {
      d.givenActionState = 'IN_PROGRESS'
    })
    await uploadDocumentsInBatches(selectedDocuments)
    emit('update-document-list-upload')
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

async function uploadDocumentsInBatches(documents: ExplorerUploadDocument[]) {
  let batchIndex = 0
  let uploadedDocumentCount = 0
  let documentUploadedWithSuccess = 0
  let documentUploadedWithError = 0
  let failedDocumentDetails: string[] = []
  const destinationFolder = { ...currentExplorerFolder.value }
  while (uploadedDocumentCount < documents.length) {
    // Selects up to 5 documents for upload or fewer if remaining documents are less than 5
    const documentsToUpload =
      documents.slice(batchIndex, Math.min(batchIndex + 5, documents.length))
    await Promise.allSettled(documentsToUpload.map(async (document) => {
      try {
        uploadedDocumentCount++
        const uploadResult =
          await uploadDocument(
            props.currentService,
            props.selectedEntity,
            document.file,
            currentExplorerFolder.value.id
          )
        if (uploadResult) {
          document.givenActionState = 'DONE'
          documentUploadedWithSuccess++
        }
        return uploadResult
      } catch (error: any) {
        documentUploadedWithError++
        document.codeError = error?.response?.status
        failedDocumentDetails.push(`${document.file.name}`)
        if (document.codeError === '500') {
          document.givenActionState = 'FAILED'
        } else {
          document.givenActionState = 'ERROR'
          document.isSelected = false
        }
        return null
      }
    }))

    batchIndex += 5
  }

  trackDepositedDocument({
    serviceName: props.currentServiceName,
    depositedDocumentsCount: documents.length,
    successfulDepositsCount: documentUploadedWithSuccess,
    failedDepositsCount: documentUploadedWithError,
    destinationFolder: destinationFolder.name
  })

  if (documentUploadedWithSuccess === documents.length) {
    triggerSuccessNotification(documentUploadedWithSuccess, destinationFolder.name)
  }
  if (failedDocumentDetails.length > 0) {
    const errorDetails = failedDocumentDetails.join(', ')
    const failedCount = documents.length - documentUploadedWithSuccess
    triggerErrorNotification(failedCount, errorDetails)
  }
  if (documents.length === uploadedDocumentCount &&
    explorerDocuments.value.filter(d => !d.isSelected)) {
    modalActionsbuttons.value =
    generateActionsForModal(['CAN_ADD_DOCUMENT', 'CANCEL_ADD_DOCUMENT'], modalButtonsUpload)
  }

  if (!explorerDocuments.value.some(d => d.givenActionState === 'TO_DO')) {
    modalActionsbuttons.value =
    generateActionsForModal(['CAN_ADD_DOCUMENT', 'CANCEL_ADD_DOCUMENT'], modalButtonsUpload)
    modalActionsbuttons.value.filter(d => d.buttonActionName ===
      'modal-add-document-action-click')[0].disabled = true
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
  if (explorerDocuments.value.some(d => d.givenActionState === 'DONE')) {
    emit('refresh-documents-list')
  }
  explorerDocuments.value = []
  modalActionsbuttons.value.filter(d => d.buttonActionName ===
      'modal-add-document-action-click')[0].disabled = false
  currentExplorerFolder.value = props.folder
  emit('close-upload-documents-modal')
}

const canCloseModal = computed(() =>
  !explorerDocuments.value.some(doc => doc.givenActionState === 'IN_PROGRESS'))

// Notifications Scope
const triggerSuccessNotification = (documentsCount: number, folderName : string) => {
  toastPlugin({
    message: documentsCount > 1
      ? t('notifications.successMsg.plural',
        { documentCount: documentsCount, folderName })
      : t('notifications.successMsg.single', { folderName }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}
const triggerErrorNotification = (failedCount : number, errorDetails : string ) => {
  toastPlugin({
      message: t('notifications.errorMsg', { failedCount , errorDetails }, failedCount),
      icon: PICheck,
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
    "modalTitle": "Déposer 0 document dans {folderName} | Déposer 1 document dans {folderName} | Déposer {count} documents dans {folderName}",
    "folderList": {
      "explorerUnauthorizedGivenActionMessage": "Vous n'êtes pas autorisé à déposer dans ce dossier",
      "foldersListEmptyFolderLabel": "There is no subfolder"
    },
    "documentsList": {
      "noDeposableDocumentsLabel": "Aucun document ne peut être déposé dans votre espace documentaire."
    },
    "notifications": {
      "successMsg": {
        "plural": "Les {documentCount} documents ont été déposés dans le dossier {folderName}",
        "single": "1 document a été déposé dans le dossier {folderName}"
      },
      "errorMsg": "1 document n'a pas pu être déposé : {errorDetails}.|{failedCount} documents n'ont pas pu être déposés : {errorDetails}."

    },
    "header": {
      "title": "Certains documents ne peuvent pas être déposés dans votre espace documentaire"
    }
  },
  "fr-FR": {
    "modalTitle": "Déposer 0 document dans {folderName} | Déposer 1 document dans {folderName} | Déposer {count} documents dans {folderName}",
    "folderList": {
      "explorerUnauthorizedGivenActionMessage": "Vous n'êtes pas autorisé à déposer dans ce dossier",
      "foldersListEmptyFolderLabel": "Aucun sous-dossier"
    },
    "documentsList": {
      "noDeposableDocumentsLabel": "Aucun document ne peut être déposé dans votre espace documentaire."
    },
    "notifications": {
      "successMsg": {
        "plural": "Les {documentCount} documents ont été déposés dans le dossier {folderName}",
        "single": "1 document a été déposé dans le dossier {folderName}"
      },"errorMsg": "1 document n'a pas pu être déposé : {errorDetails}.|{failedCount} documents n'ont pas pu être déposés : {errorDetails}."
    },
    "header": {
      "title": "Certains documents ne peuvent pas être déposés dans votre espace documentaire"
    }
  }
}
</i18n>
