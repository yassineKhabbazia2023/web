import { ref, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { downloadFile, getFileNameFromContentDisposition } from '@pulse/common/helpers'
import type { PennylaneDocument } from '@pulse/common/types'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { DEFAULT_DOCUMENTS_ARCHIVE_FILE_NAME } from './ged-v2.consts'

interface GedV2DocumentsArchiveDownloadOptions {
  accountNumber: MaybeRefOrGetter<string>
  accountId: MaybeRefOrGetter<number>
  selectedDocumentIds: Ref<PennylaneDocument['id'][]>
  successMessage: MaybeRefOrGetter<string>
  errorMessage: MaybeRefOrGetter<string>
}

export function useGedV2DocumentsArchiveDownload({
  accountNumber,
  accountId,
  selectedDocumentIds,
  successMessage,
  errorMessage,
}: GedV2DocumentsArchiveDownloadOptions) {
  const isDownloadingArchive = ref<boolean>(false)

  async function downloadSelectedDocuments() {
    const downloadedDocumentIds = [...selectedDocumentIds.value]
    isDownloadingArchive.value = true
    try {
      const { content, contentDisposition } = await PennylaneService.getDocumentsArchive(
        toValue(accountNumber),
        toValue(accountId),
        downloadedDocumentIds,
      )
      if (content.byteLength === 0) {
        throw new Error('The pennylane documents archive is empty')
      }
      downloadFile(content, getFileNameFromContentDisposition(contentDisposition, DEFAULT_DOCUMENTS_ARCHIVE_FILE_NAME))
      // Keep documents selected while the archive was being fetched
      selectedDocumentIds.value = selectedDocumentIds.value.filter(
        (selectedDocumentId) => downloadedDocumentIds.includes(selectedDocumentId) === false,
      )
      displayNotification('success', toValue(successMessage))
    } catch (e) {
      logger.error('Error while downloading pennylane documents archive', e)
      displayNotification('error', toValue(errorMessage))
    } finally {
      isDownloadingArchive.value = false
    }
  }

  return {
    isDownloadingArchive,
    downloadSelectedDocuments,
  }
}
