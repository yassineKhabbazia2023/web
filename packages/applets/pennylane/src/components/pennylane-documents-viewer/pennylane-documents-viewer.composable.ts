import { ref } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { logger, getFileExtension } from '@pulse/core'
import { getIconFileName, displayNotification } from '@pulse/styleguide'
import { APICallStatus } from '@pulse/common/enums'
import { getDocumentType, getDocumentPreviewImage } from './pennylane-documents-viewer.helper'
import type { FileExtension } from '@pulse/core/types'
import type { IconName } from '@pulse/styleguide/types'

export function usePennylaneDocumentViewer(
  technicalErrorMessage: string,
) {
  const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const previewImage = ref<string|Blob>('')
  const fileExtension = ref<FileExtension>()
  const iconName = ref<IconName>()

  async function loadDocument({
    documentName,
    accountNumber,
    accountId,
    documentId,
  }: {
    documentName: string
    accountNumber: string
    accountId: number
    documentId: number
  }) {
    fileExtension.value = undefined
    iconName.value = undefined
    previewImage.value = ''

    try {
      apiCallStatus.value = APICallStatus.LOADING
      const documentSrc = documentId === undefined
        ? undefined
        : await PennylaneService.getDocumentContent(
          accountNumber,
          accountId,
          documentId,
        )
      const extension = getFileExtension(documentName)
      const iconFileName = getIconFileName(extension, 'filetypeTxt')
      const documentType = getDocumentType(extension)

      fileExtension.value = extension
      iconName.value = iconFileName
      previewImage.value = getDocumentPreviewImage(documentSrc, documentType)
      apiCallStatus.value = APICallStatus.SUCCESS
    } catch (e) {
      apiCallStatus.value = APICallStatus.ERROR
      displayNotification('error', technicalErrorMessage)
      logger.error('Error while loading document content:', e)
    }
  }

  return {
    apiCallStatus,
    iconName,
    previewImage,
    fileExtension,
    loadDocument,
  }
}
