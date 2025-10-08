import type { FileExtension } from '@pulse/toolbox/types'
import { isPdfDocument } from '@pulse/toolbox'

export function getDocumentType(fileExtension?: FileExtension) {
  if (fileExtension === undefined) {
    return ''
  }
  const isPdf = isPdfDocument(fileExtension)
  const documentType = isPdf === true ? 'application/pdf' : 'image/' + fileExtension

  return documentType
}

export function getDocumentPreviewImage(
  documentSrc: string,
  documentType: string,
) {
  if (documentSrc === undefined) {
    return ''
  }
  const documentBlob = new Blob([documentSrc], {
    type: documentType,
  })
  const previewImage = URL.createObjectURL(documentBlob)

  return previewImage
}
