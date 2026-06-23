import type { BeneficiaryDocumentType } from './beneficiaries.enums'

export interface BeneficiaryDocument {
  id: string
  fileOrder: number
  fileName: string
  contentType: string
  uploadedAt: string
  uploadedBy: string
}

export interface Beneficiary {
  beneficiaryId: string
  firstName: string
  lastName: string
  isComplete: boolean
  documentType: BeneficiaryDocumentType | null
  documents: BeneficiaryDocument[]
}

export interface BeneficiariesResponse {
  prospectId: number
  beneficiaries: Beneficiary[]
}
