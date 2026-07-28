import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type {
  ComplementaryDocumentsEmits,
  UseComplementaryDocumentsOptions,
} from './complementary-documents.types'

export function useComplementaryDocuments(
  options: UseComplementaryDocumentsOptions,
  emit: ComplementaryDocumentsEmits,
) {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const isSaving = ref(false)
  const selectedFiles = ref<File[]>([])

  const hasPendingUploads = computed(() => selectedFiles.value.length > 0)

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
      // Let the parent re-sync the single source of truth so persisted uploads appear.
      emit('saved')
    }
  }

  return {
    isSaving,
    selectedFiles,
    hasPendingUploads,
    onSave,
  }
}
