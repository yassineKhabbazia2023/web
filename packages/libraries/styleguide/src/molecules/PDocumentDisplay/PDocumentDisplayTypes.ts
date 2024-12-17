import type { FileExtension } from '@pulse/core/types'

export interface DocumentPreviewResponse {
  data: ArrayBuffer
  headers: { [key: string]: string }
}
export interface PDocumentDisplayProps {
  pSrc: string | Blob | DocumentPreviewResponse
  pDocumentExtension?: FileExtension
  pIsLoading: boolean
  errorMsgTitle: string
  errorMsgText: string
}
