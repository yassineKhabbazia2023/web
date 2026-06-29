import type { SupportingDocumentType } from '@entities/enums'
import type { SupportingDocumentItem, UploadedSupportingDocument } from '@entities/services/conformity-documents'

export interface SupportingDocumentsProps {
  // Predefined supporting document items (complementary excluded), provided by the parent.
  items: SupportingDocumentItem[]
  // True while the parent fetches the shared supporting-documents response.
  isLoading: boolean
  // The supporting-documents step is completed: read-only (no save, no delete).
  isCompleted: boolean
}

export interface SupportingDocumentsEmits {
  (event: 'saved'): void
  (event: 'deleted'): void
}

export interface SupportingDocumentDeletionTarget {
  document: UploadedSupportingDocument
}

export interface SupportingDocumentUpload {
  type: SupportingDocumentType
  file: File
}

// Locally selected (not yet uploaded) files for each document type (up to the remaining slots).
export type SupportingDocumentSelection = Partial<Record<SupportingDocumentType, File[]>>

export interface UseSupportingDocumentsOptions {
  saveSuccessMessage: string
  saveErrorMessage: string
  // Predefined required document items (complementary excluded), read reactively from the parent props.
  getItems: () => SupportingDocumentItem[]
}
