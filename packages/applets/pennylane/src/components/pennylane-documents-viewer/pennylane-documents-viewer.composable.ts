import { ref } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { logger, getFileExtension } from '@pulse/toolbox'
import { getIconFileName, displayNotification } from '@pulse/styleguide'
import { APICallStatus } from '@pulse/common/enums'
import { getDocumentType, getDocumentPreviewImage } from './pennylane-documents-viewer.helper'
import type { FileExtension } from '@pulse/toolbox/types'
import type { IconName } from '@pulse/styleguide/types'
import { HTTP_RESPONSES } from '@pulse/common/constants'

export function usePennylaneDocumentViewer(
  technicalErrorMessage: string,
) {
  const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
  const previewImage = ref<string|Blob>('')
  const fileExtension = ref<FileExtension>()
  const iconName = ref<IconName>()
  const documentSrc = ref<any>()
  const errorStatus = ref<number>()

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
      errorStatus.value = undefined
      documentSrc.value = documentId === undefined
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
      previewImage.value = getDocumentPreviewImage(documentSrc.value, documentType)
      apiCallStatus.value = APICallStatus.SUCCESS
    } catch (error: any) {
      apiCallStatus.value = APICallStatus.ERROR
      errorStatus.value = error.status
      if (error.status !== HTTP_RESPONSES.NOT_FOUND) {
        displayNotification('error', technicalErrorMessage)
      }
      logger.error('Error while loading document content:', error)
    }
  }

  return {
    documentSrc,
    apiCallStatus,
    iconName,
    previewImage,
    fileExtension,
    errorStatus,
    loadDocument,
  }
}
