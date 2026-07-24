import type { OnboardingStep, OnboardingStepStatus } from '@entities/modules/entity/prospect/conformity/prospect-conformity.enums'

export interface OnboardingStepResponse {
  id: OnboardingStep
  status: OnboardingStepStatus
}

// Body returned by the createProspect endpoint on a 422 business validation error
export interface CreateProspectErrorResponse {
  errorMessage?: string
}
