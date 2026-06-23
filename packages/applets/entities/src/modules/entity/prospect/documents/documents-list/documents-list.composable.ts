import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { RequiredDocument } from '@entities/services/conformity-documents'
import { formatDateToLocale } from '@entities/helpers'
import type { DocumentsListItem } from '@pulse/styleguide/types'

export function useDocumentsList() {
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  const documents = ref<RequiredDocument[]>([])
  const isLoading = ref(false)

  const documentsListItems = computed<DocumentsListItem[]>(() =>
    documents.value.map((document) => ({
      documentId: String(document.fileUploadedId),
      documentName: document.fileName ?? document.label,
      documentDepositDate: document.uploadedAt === null ? '' : formatDateToLocale(document.uploadedAt),
      documentDepositedBy: document.depositedBy === null
        ? ''
        : `${document.depositedBy.firstName} ${document.depositedBy.lastName}`,
    })),
  )

  const loadDocuments = async (): Promise<void> => {
    if (currentEntity.value === undefined) {
      return
    }
    isLoading.value = true
    try {
      const response = await ConformityDocumentsService.getConformityDocuments(currentEntity.value.accountId)
      documents.value = response.requiredDocs.filter((document) => document.fileUploadedId !== null)
    } catch (error) {
      logger.error('Error fetching conformity documents', error)
    } finally {
      isLoading.value = false
    }
  }

  const downloadDocument = async (documentId: string): Promise<void> => {
    const matchingDocument = documents.value.find(
      (item) => String(item.fileUploadedId) === documentId,
    )
    if (matchingDocument === undefined || currentEntity.value === undefined) {
      return
    }
    try {
      const content = await ConformityDocumentsService.getConformityDocumentContent(
        currentEntity.value.accountId,
        documentId,
      )
      downloadFile(content, matchingDocument.fileName ?? matchingDocument.label)
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
