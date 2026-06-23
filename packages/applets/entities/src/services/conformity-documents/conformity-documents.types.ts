import type { ConformityDocumentType } from '@entities/enums'

export interface ConformityDocumentDepositor {
  firstName: string
  lastName: string
}

export interface RequiredDocument {
  type: ConformityDocumentType
  label: string
  fileUploadedId: number | null
  fileName: string | null
  uploadedAt: string | null
  depositedBy: ConformityDocumentDepositor | null
}

export interface ConformityDocumentsResponse {
  status: string
  isComplete: boolean
  requiredDocs: RequiredDocument[]
}

export interface ConformityDocumentItem {
  id: string
  name: string
  depositDate: string
  depositedBy: ConformityDocumentDepositor
  downloadUrl: string
}
