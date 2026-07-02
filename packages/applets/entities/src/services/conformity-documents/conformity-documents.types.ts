import type { SupportingDocumentType } from '@entities/enums'

// Shared shape of every document returned by the prospect `/documents` endpoint.
export interface ConformityDocument {
  id: string
  fileName: string
  contentType: string
  uploadedAt: string
  uploadedBy: string
}

// Returned by the dedicated /onboarding/{accountId}/supporting-documents endpoint:
// the backend pairs each predefined supporting document type with its uploaded document (or null).
export interface UploadedSupportingDocument {
  id: number
  fileName: string
}

export interface SupportingDocumentItem {
  type: SupportingDocumentType
  // Documents already uploaded for this type (up to maxFiles). COMPLEMENTARY carries the free-form ones.
  documents: UploadedSupportingDocument[]
  // Number of files allowed for this document type.
  maxFiles: number
}

export interface SupportingDocumentsResponse {
  documents: SupportingDocumentItem[]
}
