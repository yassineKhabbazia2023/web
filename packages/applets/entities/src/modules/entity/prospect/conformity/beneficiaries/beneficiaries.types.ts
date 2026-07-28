import type { FormItemRule } from '@pulse/styleguide/types'
import type { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'

export interface BeneficiaryFormState {
  documentType: BeneficiaryDocumentType | null
  firstName: string
  lastName: string
  // Indexed by upload zone (CNI: 0 = recto, 1 = verso); a zone without a
  // pending file holds null, so positions never shift between zones
  files: (File | null)[]
}

export type BeneficiaryFormRules = Record<'documentType' | 'lastName' | 'firstName', FormItemRule[]>

export interface UseBeneficiariesEmits {
  (e: 'refresh-steps'): void
}
