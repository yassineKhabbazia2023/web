import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { OnboardingStep, OnboardingStepStatus } from '../../prospect-conformity.enums'
import { PROSPECT_CONFORMITY_STEP_SLUGS, PROSPECT_CONFORMITY_STEPS } from '../../prospect-conformity.consts'
import ConformityStepper from './conformity-stepper.vue'

function buildStepStatusById(completedSteps: readonly OnboardingStep[]): Map<OnboardingStep, OnboardingStepStatus> {
  return new Map(PROSPECT_CONFORMITY_STEPS.map((step) => [
    step.id,
    completedSteps.includes(step.id) ? OnboardingStepStatus.Completed : OnboardingStepStatus.InProgress,
  ]))
}

const ALL_STEP_IDS = PROSPECT_CONFORMITY_STEPS.map((step) => step.id)
const PARTIALLY_COMPLETED_STEP_IDS = [OnboardingStep.Beneficiary, OnboardingStep.SupportingDocuments]

const meta: Meta<typeof ConformityStepper> = {
  title: 'Applets/Entities/Prospect/Conformity/Stepper',
  component: ConformityStepper,
  tags: ['autodocs'],
  render: (args) => ({
    components: { ConformityStepper },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 420px; padding: 24px;">
        <ConformityStepper v-bind="args" />
      </div>
    `,
  }),
}

export default meta
type Story = StoryObj<typeof meta>

export const Loading: Story = {
  args: {
    isLoading: true,
    steps: [],
    stepStatusById: new Map(),
    completedCount: 0,
    totalCount: 0,
    areAllStepsCompleted: false,
    selectedId: '',
  },
}

export const PartiallyCompleted: Story = {
  args: {
    isLoading: false,
    steps: PROSPECT_CONFORMITY_STEPS,
    stepStatusById: buildStepStatusById(PARTIALLY_COMPLETED_STEP_IDS),
    completedCount: PARTIALLY_COMPLETED_STEP_IDS.length,
    totalCount: PROSPECT_CONFORMITY_STEPS.length,
    areAllStepsCompleted: false,
    // First step still to complete, like the page's auto-focus would select.
    selectedId: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.CommercialProposal],
  },
}

export const FullyCompleted: Story = {
  args: {
    isLoading: false,
    steps: PROSPECT_CONFORMITY_STEPS,
    stepStatusById: buildStepStatusById(ALL_STEP_IDS),
    completedCount: PROSPECT_CONFORMITY_STEPS.length,
    totalCount: PROSPECT_CONFORMITY_STEPS.length,
    areAllStepsCompleted: true,
    selectedId: PROSPECT_CONFORMITY_STEP_SLUGS[OnboardingStep.Beneficiary],
  },
}
