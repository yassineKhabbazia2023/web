import type { UploadFile, UploadRawFile } from '@pulse/styleguide/types'
import type { Beneficiary, BeneficiaryDocument } from '@entities/modules/entity/prospect/types'
import type { BeneficiaryFormState } from '../../beneficiaries.types'
import { OnboardingStepStatus } from '../../../prospect-conformity.enums'

export interface BeneficiaryDocumentUploadProps {
  beneficiary: Beneficiary
  formState: BeneficiaryFormState
  beneficiaryStepStatus?: OnboardingStepStatus
}

export interface BeneficiaryDocumentUploadEmits {
  'files-selected': [zoneIndex: number, files: File[]]
  'file-deleted': [zoneIndex: number, file: UploadFile | UploadRawFile]
  'document-deletion-requested': [document: BeneficiaryDocument]
}
