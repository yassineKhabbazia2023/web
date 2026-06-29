import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { UploadedSupportingDocument } from '@entities/services/conformity-documents'
import type {
  ComplementaryDocumentDeletionTarget,
  ComplementaryDocumentsEmits,
  UseComplementaryDocumentsOptions,
} from './complementary-documents.types'

export function useComplementaryDocuments(
  options: UseComplementaryDocumentsOptions,
  emit: ComplementaryDocumentsEmits,
) {
  const { currentEntity, currentEntityId } = storeToRefs(useCurrentEntityStore())

  const prospectId = computed(() => currentEntity.value?.prospectId ?? undefined)

  const isSaving = ref(false)
  const selectedFiles = ref<File[]>([])
  // Bumped after each save to remount the PUpload and clear its internal file list.
  const uploadResetKey = ref(0)

  const hasPendingUploads = computed(() => selectedFiles.value.length > 0)

  const onFilesSelected = (files: File[], availableSlots: number) => {
    // Initial files coming from the API have no raw File attached, filter them out, then cap.
    selectedFiles.value = files.filter((file) => file instanceof File).slice(0, availableSlots)
  }

  const onRemoveSelectedFile = (fileToRemove: File) => {
    selectedFiles.value = selectedFiles.value.filter((file) => file !== fileToRemove)
  }

  const onSave = async () => {
    const entityId = currentEntityId.value
    if (entityId === undefined || selectedFiles.value.length === 0) {
      return
    }
    isSaving.value = true
    try {
      // allSettled (not all): some POSTs may have succeeded server-side even if
      // another fails, so we report partial failure rather than hiding it.
      const results = await Promise.allSettled(
        // COMPLEMENTARY is the backend document type used for free-form complementary documents.
        selectedFiles.value.map((file) =>
          ConformityDocumentsService.uploadConformityDocument(entityId, SupportingDocumentType.COMPLEMENTARY, file),
        ),
      )
      results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .forEach((result) => logger.error('Error uploading complementary documents', result.reason))
      const hasFailure = results.some((result) => result.status === 'rejected')
      displayNotification(
        hasFailure ? 'error' : 'success',
        hasFailure ? options.saveErrorMessage : options.saveSuccessMessage,
      )
    } finally {
      isSaving.value = false
      selectedFiles.value = []
      uploadResetKey.value += 1
      // Let the parent re-sync the single source of truth so persisted uploads appear.
      emit('saved')
    }
  }

  const documentPendingDeletion = ref<ComplementaryDocumentDeletionTarget>()

  const isDeleteDialogOpen = computed({
    get: () => documentPendingDeletion.value !== undefined,
    set: (isOpen: boolean) => {
      if (isOpen === false) {
        documentPendingDeletion.value = undefined
      }
    },
  })

  const onRequestDocumentDeletion = (document: UploadedSupportingDocument) => {
    documentPendingDeletion.value = { document }
  }

  // The deletion itself (API call + notifications) is owned by the shared
  // DeleteDocumentDialog; here we just clear state and let the parent reload.
  const onDocumentDeleted = () => {
    documentPendingDeletion.value = undefined
    emit('deleted')
  }

  return {
    prospectId,
    isSaving,
    selectedFiles,
    uploadResetKey,
    hasPendingUploads,
    isDeleteDialogOpen,
    documentPendingDeletion,
    onFilesSelected,
    onRemoveSelectedFile,
    onSave,
    onRequestDocumentDeletion,
    onDocumentDeleted,
  }
}
