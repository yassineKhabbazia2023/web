import { OnboardingStepStatus } from '../../../prospect-conformity.enums'

export interface BeneficiaryActionsProps {
  canSave: boolean
  isSaving: boolean
  isValidating: boolean
  beneficiaryStepStatus?: OnboardingStepStatus
}

export interface BeneficiaryActionsEmits {
  'save-documents': []
  'validate-all-beneficiaries': []
}
