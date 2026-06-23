import type { FormItemRule } from 'element-plus'
import type { BeneficiaryDocument, BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import type { OnboardingStepStatus } from '../prospect-conformity.enums'

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
  (e: 'documents-saved'): void
}

export interface BeneficiariesProps {
  beneficiaryStepStatus?: OnboardingStepStatus
}
