import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import type { PennylaneDocument } from '@pulse/common/types'
import { getFileExtension, logger } from '@pulse/toolbox'
import { getIconFileName, displayNotification } from '@pulse/styleguide'
import { downloadFile } from '@pulse/common/helpers'

export function getFormattedPennylaneDocuments(
  pennylaneDocuments: PennylaneDocument[],
  pathPrefix: string,
): FormattedPennylaneDocument[] {
  return pennylaneDocuments
    .map((pennylaneDocument) => {
      const extension = getFileExtension(pennylaneDocument.name)
      const iconName = getIconFileName(extension, 'filetypeTxt')

      return {
        ...pennylaneDocument,
        iconName,
        path: `${pathPrefix}${pennylaneDocument.path}`,
      }
    })
}

export function downloadDocument({
  documentSrc,
  documentName,
  successMessage,
  errorMessage,
}: {
  documentSrc: any
  documentName: string
  successMessage: string
  errorMessage: string
}) {
  try {
    downloadFile(documentSrc, documentName)
    displayNotification('success', successMessage)
  } catch (e) {
    logger.error('Something wrong occurred', e)
    displayNotification('error', errorMessage)
  }
}
