import type { UploadedSupportingDocument } from '@entities/services/conformity-documents'

export interface ComplementaryDocumentsProps {
  // Already-uploaded complementary documents, provided by the parent.
  documents: UploadedSupportingDocument[]
  maxFiles: number
  // True while the parent fetches the shared supporting-documents response.
  isLoading: boolean
  // The supporting-documents step is completed: read-only (no save, no delete).
  isCompleted: boolean
}

export interface ComplementaryDocumentsEmits {
  (event: 'saved'): void
  (event: 'deleted'): void
}

export interface ComplementaryDocumentDeletionTarget {
  document: UploadedSupportingDocument
}

export interface UseComplementaryDocumentsOptions {
  saveSuccessMessage: string
  saveErrorMessage: string
}
