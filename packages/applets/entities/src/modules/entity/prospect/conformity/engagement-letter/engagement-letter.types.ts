import type { OnboardingStepStatus } from '../prospect-conformity.enums'

export interface EngagementLetterProps {
  status?: OnboardingStepStatus
  isLoading?: boolean
}

export interface EngagementLetterEmits {
  (event: 'sent'): void
}
