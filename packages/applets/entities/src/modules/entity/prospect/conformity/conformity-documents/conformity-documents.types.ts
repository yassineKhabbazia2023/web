import type { OnboardingStepStatus } from '../prospect-conformity.enums'

export interface ConformityDocumentsProps {
  supportingStepStatus?: OnboardingStepStatus
}

export interface ConformityDocumentsEmits {
  (event: 'refresh-steps'): void
}
