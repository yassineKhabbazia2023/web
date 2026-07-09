import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getMockedEntitySummary } from '@pulse/common/mocks'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'
import Payment from './payment.vue'

// Seeds the current entity (used as accountId and signatory flag) and stubs the API so the
// story renders the chosen state offline, without a backend.
function mockPaymentPreference(paymentType: ConformityPaymentType | null, isSignatory = true): void {
  useCurrentEntityStore().setCurrentEntity(getMockedEntitySummary({ accountId: 1, isSignatory }))
  ConformityPaymentService.getPaymentPreference = () => Promise.resolve({ paymentType })
  ConformityPaymentService.setOtherPaymentPreference = () => Promise.resolve()
  ConformityPaymentService.resetPaymentPreference = () => Promise.resolve()
  ProspectsService.fetchOnboardingStep = () => Promise.resolve({
    id: OnboardingStep.PaymentMethod,
    status: paymentType === null ? OnboardingStepStatus.ToDo : OnboardingStepStatus.Completed,
  })
}

const renderWithState = ({
  paymentType,
  isSignatory = true,
}: {
  paymentType: ConformityPaymentType | null
  isSignatory?: boolean
}): Story['render'] => (args) => ({
  components: { Payment },
  setup() {
    mockPaymentPreference(paymentType, isSignatory)
    return { args }
  },
  template: `
    <div style="padding: 24px;">
      <div style="width: 600px;">
        <Payment v-bind="args" />
      </div>
    </div>
  `,
})

const meta: Meta<typeof Payment> = {
  title: 'Applets/Entities/Prospect/Conformity/Payment/Client',
  component: Payment,
  tags: ['autodocs'],
  argTypes: {
    // Client stories are locked to the client view.
    isCollaborator: {
      table: { disable: true },
    },
  },
  args: {
    isCollaborator: false,
    fallbackTitle: 'Moyens de paiement',
  },
  render: renderWithState({ paymentType: null }),
}

export default meta
type Story = StoryObj<typeof meta>

export const NotSelected: Story = {
  render: renderWithState({ paymentType: null }),
}

// A client who is not the prospect's signatory cannot act: the action buttons are hidden and a
// read-only "pending" alert is shown instead.
export const NotSelectedNonSignatory: Story = {
  render: renderWithState({ paymentType: null, isSignatory: false }),
}

export const MandateSepa: Story = {
  render: renderWithState({ paymentType: ConformityPaymentType.MandateSepa }),
}

export const Other: Story = {
  render: renderWithState({ paymentType: ConformityPaymentType.Other }),
}

// A non-signatory client sees a read-only message for the OTHER method and cannot revert to SEPA:
// the "back to SEPA mandate" button is hidden.
export const OtherNonSignatory: Story = {
  render: renderWithState({ paymentType: ConformityPaymentType.Other, isSignatory: false }),
}
