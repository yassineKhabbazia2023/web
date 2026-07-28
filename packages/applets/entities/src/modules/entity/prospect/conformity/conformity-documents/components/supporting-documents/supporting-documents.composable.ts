import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { UploadedSupportingDocument } from '@entities/services/conformity-documents'
import { SupportingDocumentsManager } from './supporting-documents.manager'
import type {
  SupportingDocumentDeletionTarget,
  SupportingDocumentSelection,
  SupportingDocumentsEmits,
  UseSupportingDocumentsOptions,
} from './supporting-documents.types'

export function useSupportingDocuments(options: UseSupportingDocumentsOptions, emit: SupportingDocumentsEmits) {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const isSaving = ref(false)
  const selectedFilesByType = ref<SupportingDocumentSelection>({})

  // The template feeds each upload component from selectedFilesByType[item.type],
  // so every item type needs its own array as soon as the parent items arrive
  // (initial load and refetches alike) — hence a watch instead of an event.
  watch(options.getItems, (items) => {
    for (const item of items) {
      if (selectedFilesByType.value[item.type] === undefined) {
        selectedFilesByType.value[item.type] = []
      }
    }
  }, { immediate: true })

  const hasPendingUploads = computed(() =>
    SupportingDocumentsManager.hasPendingUploads(selectedFilesByType.value),
  )

  // Save is allowed only when every required supporting document is covered (persisted or pending)
  // and there is at least one pending file to upload.
  const canSave = computed(() =>
    hasPendingUploads.value
    && SupportingDocumentsManager.areAllRequiredDocumentsProvided(options.getItems(), selectedFilesByType.value),
  )

  const onSave = async () => {
    const entityId = currentEntityId.value
    const pendingUploads = SupportingDocumentsManager.getPendingUploads(selectedFilesByType.value)
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
        .forEach((result) => logger.error('Error uploading supporting documents', result.reason))
      const hasFailure = results.some((result) => result.status === 'rejected')
      displayNotification(
        hasFailure ? 'error' : 'success',
        hasFailure ? options.saveErrorMessage : options.saveSuccessMessage,
      )
    } finally {
      isSaving.value = false
      // Empty each selection without dropping the keys: the upload components
      // keep their v-model bound while the parent refetches the items.
      for (const documentType of Object.keys(selectedFilesByType.value) as SupportingDocumentType[]) {
        selectedFilesByType.value[documentType] = []
      }
      // Let the parent re-sync the single source of truth so persisted uploads appear.
      emit('saved')
    }
  }

  const documentPendingDeletion = ref<SupportingDocumentDeletionTarget>()

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
    currentEntityId,
    isSaving,
    selectedFilesByType,
    hasPendingUploads,
    canSave,
    isDeleteDialogOpen,
    documentPendingDeletion,
    onSave,
    onRequestDocumentDeletion,
    onDocumentDeleted,
  }
}
