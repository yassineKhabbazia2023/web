export interface DocumentPreviewResponse {
  data: ArrayBuffer
  headers: { [key: string]: string };
}
export interface PDocumentDisplayProps {
  pSrc: string | Blob | DocumentPreviewResponse
  pDocumentExtension: string
  pIsLoading: boolean
  errorMsgTitle: string
  errorMsgText: string
}
