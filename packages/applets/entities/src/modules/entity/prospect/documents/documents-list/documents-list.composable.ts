import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { ConformityDocument } from '@entities/services/conformity-documents'
import { formatDateToLocale } from '@entities/helpers'
import type { DocumentsListItem } from '@pulse/styleguide/types'

export function useDocumentsList() {
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  const documents = ref<ConformityDocument[]>([])
  const isLoading = ref(false)

  const documentsListItems = computed<DocumentsListItem[]>(() =>
    documents.value.map((document) => ({
      documentId: document.id,
      documentName: document.fileName,
      documentDepositDate: formatDateToLocale(document.uploadedAt),
      documentDepositedBy: document.uploadedBy,
    })),
  )

  const loadDocuments = async (): Promise<void> => {
    if (currentEntity.value === undefined) {
      return
    }
    isLoading.value = true
    try {
      const response = await ConformityDocumentsService.getConformityDocuments(currentEntity.value.accountId)
      // Flatten every document category exposed by the endpoint into a single list.
      documents.value = [
        ...response.supportingDocuments,
        ...response.beneficiaryDocuments,
        ...(response.commercialProposal === null ? [] : [response.commercialProposal]),
        ...(response.engagementLetter === null ? [] : [response.engagementLetter]),
      ]
    } catch (error) {
      logger.error('Error fetching conformity documents', error)
    } finally {
      isLoading.value = false
    }
  }

  const downloadDocument = async (documentId: string): Promise<void> => {
    const matchingDocument = documents.value.find((item) => item.id === documentId)
    if (matchingDocument === undefined || currentEntity.value === undefined) {
      return
    }
    try {
      const content = await ConformityDocumentsService.getConformityDocumentContent(
        currentEntity.value.accountId,
        documentId,
      )
      downloadFile(content, matchingDocument.fileName)
    } catch (error) {
      logger.error('Error downloading conformity document', error)
    }
  }

  onMounted(loadDocuments)

  return {
    documentsListItems,
    isLoading,
    downloadDocument,
  }
}
