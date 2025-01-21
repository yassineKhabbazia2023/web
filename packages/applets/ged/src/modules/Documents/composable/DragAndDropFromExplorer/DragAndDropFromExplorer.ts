import { type Ref, ref, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { PNotification } from '@pulse/styleguide'
import { getFileExtension, isExtensionAuthorized } from '@pulse/core'
import { uploadDocument } from '@ged/services/Documents'
import type { DocumentsProps } from '../../DocumentsTypes'
import { Permissions } from '@ged/models/Permissions'
import { MAX_FILE_SIZE_BYTES } from '@ged/modules/common/constants/files'
import { trackDepositedDocument } from '@ged/services/tracking/tracking.service'
import { hasDragType } from '@ged/modules/common/helpers/drag-and-drop.helper'

export function useDragAndDropFromExplorer(
  currentService: Ref<DocumentsProps['currentService']>,
  currentServiceName: Ref<DocumentsProps['currentServiceName']>,
  selectedEntity: Ref<DocumentsProps['selectedEntity']>,
  selectedFolder: Ref<DocumentsProps['selectedFolder']>,
  refreshDocumentsList: Function,
) {
  const isDropZoneVisible = ref(false)

  let dragOverTimeout: ReturnType<typeof setTimeout> | undefined
  const droppedFilesFromExplorer = ref<File[]>([])
  const validDroppedFiles = computed(() => {
    return droppedFilesFromExplorer.value.filter(file => {
      return !filesWithUnsupportedExtensions.value.includes(file) &&
             !emptyFiles.value.includes(file) &&
             !tooLargeFiles.value.includes(file)
    })
  })

  function isFileExtensionValid(file: File) {
    const fileExtension = getFileExtension(file.name)
    return isExtensionAuthorized(fileExtension)
  }

  function isFileEmpty(file: File) {
    return file.size === 0
  }

  function isFileTooLarge(file: File) {
    return file.size > MAX_FILE_SIZE_BYTES
  }

  const filesWithUnsupportedExtensions = computed(() => {
    return droppedFilesFromExplorer.value.filter(file => !isFileExtensionValid(file))
  })

  const emptyFiles = computed(() => {
    return droppedFilesFromExplorer.value.filter(file => isFileEmpty(file))
  })

  const tooLargeFiles = computed(() => {
    return droppedFilesFromExplorer.value.filter(file => isFileTooLarge(file))
  })

  // Drop section
  const isDropFromExplorerConfirmationModalVisible = ref(false)
  async function handleDropFromExplorer(event: DragEvent) {
    if (!isAllowedDropZone.value) {
      return
    }
    if (!event.dataTransfer) {
      return
    }

    // FileList prototype is not nativaly itterable
    const arrayedFiles = Array.from(event.dataTransfer.files)
    droppedFilesFromExplorer.value.push(...arrayedFiles)
    isDropZoneVisible.value = false

    showDialogIfValidFilesExist()

    if (!validDroppedFiles.value.length) {
      await displayPreUploadErrorsNotifications()
      droppedFilesFromExplorer.value.length = 0
      return
    }

    await uploadDocuments(validDroppedFiles.value)
    await displayPreUploadErrorsNotifications()
    droppedFilesFromExplorer.value.length = 0
  }

  function showDialogIfValidFilesExist() {
    if (!validDroppedFiles.value.length) {
      return
    }
    isDropFromExplorerConfirmationModalVisible.value = true
  }

  async function uploadDocuments(files: File[]) {
    const folder = selectedFolder.value
    if (!folder || !validDroppedFiles.value.length) {
      return
    }

    const documentsToUploadPromises = files.map(file => uploadDocument(
      currentService.value,
      selectedEntity.value,
      file,
      folder.id,
    ))

    try {
      const settledUploads = await Promise.allSettled(documentsToUploadPromises)
      const successfulResults: Array<any> = []
      const failedResults = []

      settledUploads.forEach(upload => {
        if (upload.status === 'fulfilled') {
          successfulResults.push(upload.value)
        } else if (upload.status === 'rejected') {
          failedResults.push(upload.reason)
        }
      })
      refreshDocumentsList()
      isDropFromExplorerConfirmationModalVisible.value = false

      trackDepositedDocument({
        serviceName: currentServiceName.value,
        depositedDocumentsCount: settledUploads.length,
        successfulDepositsCount: successfulResults.length,
        failedDepositsCount: failedResults.length,
        destinationFolder: folder.name,
      })

      await displaySuccessNotification(successfulResults.length)
      await displayConnectionErrorNotifications(failedResults.length)
    } catch (error) {
      await displayConnectionErrorNotifications()
    }
  }

  async function displaySuccessNotification(documentsCount: number) {
    if (!selectedFolder.value || !documentsCount) {
      return
    }
    PNotification({
      message: t(
        'documentsUploaded',
        {
          targetFolderName: selectedFolder.value.name,
          documentsCount,
        },
        documentsCount,
      ),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
      duration: 6000,
    })

    await nextTick()
  }

  async function displayConnectionErrorNotifications(documentsCount: number = 0) {
    if (documentsCount) {
      PNotification({
        message: t(
          'connectionLost',
          { documentsCount },
          documentsCount,
        ),
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 6000,
      })
      await nextTick()
    }
  }

  // These are the errors handled before the upload, empty files, wrong extensions ...
  // Note that when calling PNotification multiple times like this it is required to use nextTick
  // in order to make notifications stack properly
  async function displayPreUploadErrorsNotifications() {
    if (emptyFiles.value.length) {
      PNotification({
        message: t(
          'emptyDocuments',
          { documentsCount: emptyFiles.value.length },
          emptyFiles.value.length,
        ),
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 6000,
      })
    }

    if (tooLargeFiles.value.length) {
      await nextTick()
      PNotification({
        message: t(
          'limitExceededDocuments',
          { documentsCount: tooLargeFiles.value.length },
          tooLargeFiles.value.length,
        ),
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 6000,
      })
    }

    if (filesWithUnsupportedExtensions.value.length) {
      await nextTick()
      PNotification({
        message: t(
          'unknowExtensions',
          { documentsCount: filesWithUnsupportedExtensions.value.length },
          filesWithUnsupportedExtensions.value.length,
        ),
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
        duration: 6000,
      })
    }
  }

  // DragOver section
  const isAllowedDropZone = computed(() => {
    return selectedFolder.value?.permissions.includes(Permissions.CAN_UPLOAD_FILES) ?? false
  })

  function handleDragOverFromExplorer(event: DragEvent) {
    if (!hasDragType(event, 'Files')) {
      return
    }
    if (!isAllowedDropZone.value && event.dataTransfer) {
      event.dataTransfer.dropEffect = 'none'
    }

    isDropZoneVisible.value = true
    clearTimeout(dragOverTimeout)
    dragOverTimeout = setTimeout(() => {
      isDropZoneVisible.value = false
    }, 1000)
  }

  function handleDragLeaveFromExplorer() {
    isDropZoneVisible.value = false
  }

  const { t } = useI18n({
    inheritLocale: true,
    useScope: 'global',
    messages,
  })

  return {
    isDropZoneVisible,
    isAllowedDropZone,
    isDropFromExplorerConfirmationModalVisible,
    handleDropFromExplorer,
    handleDragOverFromExplorer,
    handleDragLeaveFromExplorer,
    validDroppedFiles,
  }
}

const messages = {
  'fr-FR': {
    documentsUploaded: `{documentsCount} document a été déposé dans le dossier {targetFolderName} |
                            {documentsCount} documents ont été déposés dans le dossier {targetFolderName}`,
    connectionLost: 'Connexion au serveur interrompue | Connexion interrompue pour {documentsCount} documents',
    emptyDocuments: '{documentsCount} document vide | {documentsCount} documents vides',
    limitExceededDocuments: `{documentsCount} document dépasse le poids maximum autorisé (50MB) |
                                {documentsCount} documents dépassent le poids maximum autorisé (50MB)`,
    unknowExtensions: `Format non reconnu pour {documentsCount} fichier |
                           Format non reconnu pour {documentsCount} fichiers`,
  },
  'en-US': {
    documentsUploaded: `{documentsCount} document has been uploaded to {targetFolderName} folder |
                            {documentsCount} documents have been uploaded to {targetFolderName} folder`,
    connectionLost: 'Connection to server lost | Connection to server lost for {documentsCount} documents',
    emptyDocuments: '{documentsCount} empty document | {documentsCount} documents empty',
    limitExceededDocuments: `{documentsCount} document is exceeding the maximum allowed size (50MB) |
                                {documentsCount} documents are exceeding the maximum allowed size (50MB)`,
    unknowExtensions: `Unrecognized format for {documentsCount} file |
                           Unrecognized format for {documentsCount} files`,
  },
}
