import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { downloadFile } from '@pulse/common/helpers'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { DocumentsListItem } from '@pulse/styleguide/types'
import type { DownloadTarget } from './documents-download.types'

export function useDocumentsDownload() {
  const { t } = useI18n()
  const { currentEntity } = storeToRefs(useCurrentEntityStore())

  const selectedDocuments = ref<DocumentsListItem[]>([])
  const isDownloading = ref(false)

  // Selected documents when at least one is checked, otherwise every document of the prospect.
  const resolveTargets = async (accountId: number): Promise<DownloadTarget[]> => {
    if (selectedDocuments.value.length > 0) {
      return selectedDocuments.value.map((document) => ({
        id: document.documentId,
        fileName: document.documentName,
      }))
    }

    const documents = await ConformityDocumentsService.getConformityDocuments(accountId)
    return documents.map((document) => ({ id: document.id, fileName: document.fileName }))
  }

  const downloadDocuments = async (): Promise<void> => {
    if (isDownloading.value || currentEntity.value === undefined) {
      return
    }
    isDownloading.value = true
    let hasFailure = false
    try {
      const { accountId } = currentEntity.value
      const targets = await resolveTargets(accountId)
      // One document failing must not abort the others: download each independently.
      for (const target of targets) {
        try {
          const content = await ConformityDocumentsService.getConformityDocumentContent(accountId, target.id)
          downloadFile(content, target.fileName)
        } catch (error) {
          hasFailure = true
          logger.error('Error downloading conformity document', error)
        }
      }
    } catch (error) {
      hasFailure = true
      logger.error('Error downloading conformity documents', error)
    } finally {
      isDownloading.value = false
    }
    if (hasFailure) {
      displayNotification('error', t('entities.prospect.documents.downloadError'))
    }
  }

  return {
    selectedDocuments,
    isDownloading,
    downloadDocuments,
  }
}
