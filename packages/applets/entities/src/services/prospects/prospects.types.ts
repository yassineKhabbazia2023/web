import type { OnboardingStep, OnboardingStepStatus } from '@entities/modules/entity/prospect/conformity/prospect-conformity.enums'

export interface OnboardingStepResponse {
  id: OnboardingStep
  status: OnboardingStepStatus
}
