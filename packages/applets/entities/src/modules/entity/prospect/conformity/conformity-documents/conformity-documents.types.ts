import type { ConformityDocumentType } from '@entities/enums'
import type { RequiredDocument } from '@entities/services/conformity-documents'

export interface ConformityDocumentDeletionTarget {
  document: RequiredDocument
}

export interface ConformityDocumentUpload {
  type: ConformityDocumentType
  file: File
}

// Locally selected (not yet uploaded) file for each required document type.
export type ConformityDocumentSelection = Partial<Record<ConformityDocumentType, File>>

export interface UseConformityDocumentsOptions {
  saveSuccessMessage: string
  saveErrorMessage: string
  markCompletedErrorMessage: string
}
