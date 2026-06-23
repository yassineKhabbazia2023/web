import type { OnboardingStepStatus } from '../prospect-conformity.enums'

export interface CommercialProposalProps {
  status?: OnboardingStepStatus
  isLoading?: boolean
}

export interface CommercialProposalEmits {
  (event: 'sent'): void
}
