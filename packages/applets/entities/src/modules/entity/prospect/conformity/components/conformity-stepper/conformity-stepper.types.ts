import type { OnboardingStep, OnboardingStepStatus } from '../../prospect-conformity.enums'
import type { ProspectConformityStep } from '../../prospect-conformity.types'

export interface ConformityStepperProps {
  isLoading: boolean
  // Steps to display, already restricted to the ones returned by the API.
  steps: readonly ProspectConformityStep[]
  stepStatusById: Map<OnboardingStep, OnboardingStepStatus>
  // Progression counts, computed from the raw API response.
  completedCount: number
  totalCount: number
  areAllStepsCompleted: boolean
  // Slug of the step highlighted in the tracker.
  selectedId: string
}
