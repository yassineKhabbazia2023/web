import type { FormItemRule } from 'element-plus'
import type { BeneficiaryDocument, BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'

export interface BeneficiaryFormState {
  documentType: BeneficiaryDocumentType | null
  firstName: string
  lastName: string
  files: File[]
}

export type BeneficiaryFormRules = Record<'documentType' | 'lastName' | 'firstName', FormItemRule[]>

export interface BeneficiaryDocumentDeletionTarget {
  beneficiaryId: string
  document: BeneficiaryDocument
}

export interface UseBeneficiariesEmits {
  (e: 'refresh-steps'): void
}
