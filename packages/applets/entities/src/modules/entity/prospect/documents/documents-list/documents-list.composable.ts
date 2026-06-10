import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { ConformityDocumentItem } from '@entities/services/conformity-documents'
import type { DocumentsListItem } from '@pulse/styleguide/types'

export function useDocumentsList() {
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  const documents = ref<ConformityDocumentItem[]>([])
  const isLoading = ref(false)

  const documentsListItems = computed<DocumentsListItem[]>(() =>
    documents.value.map((document) => ({
      documentId: document.id,
      documentName: document.name,
      documentDepositDate: document.depositDate,
      documentDepositedBy: `${document.depositedBy.firstName} ${document.depositedBy.lastName}`,
    })),
  )

  const loadDocuments = async (): Promise<void> => {
    if (currentEntity.value === undefined) {
      return
    }
    isLoading.value = true
    try {
      documents.value = await ConformityDocumentsService.getConformityDocuments(currentEntity.value.accountId)
    } catch (error) {
      logger.error('Error fetching conformity documents', error)
    } finally {
      isLoading.value = false
    }
  }

  const downloadDocument = (documentId: string): void => {
    const matchingDocument = documents.value.find((item) => item.id === documentId)
    if (matchingDocument === undefined) {
      return
    }
    window.open(matchingDocument.downloadUrl, '_blank', 'noopener,noreferrer')
  }

  onMounted(loadDocuments)

  return {
    documentsListItems,
    isLoading,
    downloadDocument,
  }
}
