import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { ConformityDocument } from '@entities/services/conformity-documents'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { formatDateToLocale, getInitials } from '@entities/helpers'
import type { DocumentsListItem } from '@pulse/styleguide/types'

export function useDocumentsList() {
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  const documents = ref<ConformityDocument[]>([])
  const isLoading = ref(false)

  const documentsListItems = computed<DocumentsListItem[]>(() =>
    documents.value.map((document) => {
      const [firstName, lastName] = isNotNullNorEmpty(document.uploadedBy)
        ? document.uploadedBy.split(' ')
        : []
      return {
        documentId: document.id,
        documentName: document.fileName,
        documentDepositDate: formatDateToLocale(document.uploadedAt),
        documentDepositedBy: document.uploadedBy,
        documentDepositedByInitials: getInitials(firstName, lastName),
      }
    }),
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
