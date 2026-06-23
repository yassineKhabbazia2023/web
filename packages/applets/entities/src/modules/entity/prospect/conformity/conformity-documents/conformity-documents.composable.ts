import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { ConformityDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { RequiredDocument } from '@entities/services/conformity-documents'
import { ConformityDocumentsManager } from './conformity-documents.manager'
import type {
  ConformityDocumentDeletionTarget,
  ConformityDocumentSelection,
  UseConformityDocumentsOptions,
} from './conformity-documents.types'

export function useConformityDocuments(options: UseConformityDocumentsOptions) {
  const { currentEntity, currentEntityId } = storeToRefs(useCurrentEntityStore())

  const prospectId = computed(() => currentEntity.value?.prospectId ?? undefined)

  // Will be slightly reworked once status endpoint is available
  const isLoading = ref(true)
  const isSaving = ref(false)
  const isMarkingCompleted = ref(false)
  const status = ref<string>()
  const isComplete = ref(false)
  const requiredDocuments = ref<RequiredDocument[]>([])
  const selectedFileByType = ref<ConformityDocumentSelection>({})

  const hasPendingUploads = computed(() =>
    ConformityDocumentsManager.hasPendingUploads(selectedFileByType.value),
  )

  const canMarkSectionCompleted = computed(() =>
    ConformityDocumentsManager.canMarkCompleted(isComplete.value, requiredDocuments.value),
  )

  const loadConformityDocuments = async () => {
    if (currentEntityId.value === undefined) {
      isLoading.value = false
      return
    }
    isLoading.value = true
    try {
      const response = await ConformityDocumentsService.getConformityDocuments(currentEntityId.value)
      requiredDocuments.value = response.requiredDocs
      status.value = response.status
      isComplete.value = response.isComplete === true
      selectedFileByType.value = {}
    } catch (error) {
      logger.error('Error fetching conformity documents', error)
    } finally {
      isLoading.value = false
    }
  }

  const onFileSelected = (documentType: ConformityDocumentType, selectedFiles: File[]) => {
    // PUpload enforces the single-file limit, we only mirror the current raw selection.
    const file = selectedFiles.find((selectedFile) => selectedFile instanceof File)
    selectedFileByType.value[documentType] = file
  }

  const onRemoveSelectedFile = (documentType: ConformityDocumentType) => {
    selectedFileByType.value[documentType] = undefined
  }

  const onSave = async () => {
    const entityId = currentEntityId.value
    const pendingUploads = ConformityDocumentsManager.getPendingUploads(selectedFileByType.value)
    if (entityId === undefined || pendingUploads.length === 0) {
      return
    }
    isSaving.value = true
    try {
      // allSettled (not all): some POSTs may have succeeded server-side even if
      // another fails, so we report partial failure rather than hiding it.
      const results = await Promise.allSettled(
        pendingUploads.map((upload) =>
          ConformityDocumentsService.uploadConformityDocument(entityId, upload.type, upload.file),
        ),
      )
      results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .forEach((result) => logger.error('Error uploading conformity documents', result.reason))
      const hasFailure = results.some((result) => result.status === 'rejected')
      displayNotification(
        hasFailure ? 'error' : 'success',
        hasFailure ? options.saveErrorMessage : options.saveSuccessMessage,
      )
    } finally {
      isSaving.value = false
      // Always re-sync with the server so persisted uploads appear even on partial failure.
      await loadConformityDocuments()
    }
  }

  const documentPendingDeletion = ref<ConformityDocumentDeletionTarget>()

  const isDeleteDialogOpen = computed({
    get: () => documentPendingDeletion.value !== undefined,
    set: (isOpen: boolean) => {
      if (isOpen === false) {
        documentPendingDeletion.value = undefined
      }
    },
  })

  const onRequestDocumentDeletion = (document: RequiredDocument) => {
    documentPendingDeletion.value = { document }
  }

  // The deletion itself (API call + notifications) is owned by the shared
  // DeleteDocumentDialog, the composable only refreshes the list on success.
  const onDocumentDeleted = async () => {
    documentPendingDeletion.value = undefined
    await loadConformityDocuments()
  }

  const onMarkSectionCompleted = async () => {
    if (currentEntityId.value === undefined) {
      return
    }
    isMarkingCompleted.value = true
    try {
      await ConformityDocumentsService.markConformityDocumentsAsCompleted(currentEntityId.value)
      await loadConformityDocuments()
    } catch (error) {
      logger.error('Error marking conformity documents section as completed', error)
      displayNotification('error', options.markCompletedErrorMessage)
    } finally {
      isMarkingCompleted.value = false
    }
  }

  onMounted(loadConformityDocuments)

  return {
    currentEntityId,
    prospectId,
    isLoading,
    isSaving,
    isMarkingCompleted,
    status,
    isComplete,
    requiredDocuments,
    selectedFileByType,
    hasPendingUploads,
    canMarkSectionCompleted,
    isDeleteDialogOpen,
    documentPendingDeletion,
    onFileSelected,
    onRemoveSelectedFile,
    onSave,
    onRequestDocumentDeletion,
    onDocumentDeleted,
    onMarkSectionCompleted,
  }
}
