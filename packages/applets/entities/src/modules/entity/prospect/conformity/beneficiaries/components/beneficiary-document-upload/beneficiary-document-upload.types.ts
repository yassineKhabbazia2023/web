import type { Beneficiary } from '@entities/modules/entity/prospect/types'
import type { BeneficiaryFormState } from '../../beneficiaries.types'
import { OnboardingStepStatus } from '../../../prospect-conformity.enums'

export interface BeneficiaryDocumentUploadProps {
  beneficiary: Beneficiary
  formState: BeneficiaryFormState
  beneficiaryStepStatus?: OnboardingStepStatus
  remoteDeleteUrl: string | undefined
}

export interface BeneficiaryDocumentUploadEmits {
  'zone-file-changed': [zoneIndex: number, file: File | null]
  'document-deleted': []
}
