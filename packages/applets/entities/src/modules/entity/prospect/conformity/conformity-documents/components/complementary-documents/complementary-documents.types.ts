import type { UploadedSupportingDocument } from '@entities/services/conformity-documents'

export interface ComplementaryDocumentsProps {
  // Already-uploaded complementary documents, provided by the parent.
  documents: UploadedSupportingDocument[]
  maxFiles: number
  // True while the parent fetches the shared supporting-documents response.
  isLoading: boolean
}

export interface ComplementaryDocumentsEmits {
  (event: 'saved'): void
}

export interface UseComplementaryDocumentsOptions {
  saveSuccessMessage: string
  saveErrorMessage: string
}
