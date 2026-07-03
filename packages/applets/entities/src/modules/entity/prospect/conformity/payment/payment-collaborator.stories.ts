import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getMockedEntitySummary } from '@pulse/common/mocks'
import { ConformityPaymentType } from '@entities/enums'
import { ConformityPaymentService } from '@entities/services/conformity-payment'
import Payment from './payment.vue'

// Seeds the current entity (used as accountId) and stubs the API so the story renders
// the chosen state offline, without a backend.
function mockPaymentPreference(paymentType: ConformityPaymentType | null): void {
  useCurrentEntityStore().setCurrentEntity(getMockedEntitySummary({ accountId: 1 }))
  ConformityPaymentService.getPaymentPreference = () => Promise.resolve({ paymentType })
  ConformityPaymentService.setOtherPaymentPreference = () => Promise.resolve()
  ConformityPaymentService.resetPaymentPreference = () => Promise.resolve()
}

const renderWithState = (paymentType: ConformityPaymentType | null): Story['render'] => (args) => ({
  components: { Payment },
  setup() {
    mockPaymentPreference(paymentType)
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
  title: 'Applets/Entities/Prospect/Conformity/Payment/Collaborator',
  component: Payment,
  tags: ['autodocs'],
  argTypes: {
    // Collaborator stories are locked to the collaborator view.
    isCollaborator: {
      table: { disable: true },
    },
  },
  args: {
    isCollaborator: true,
  },
  render: renderWithState(null),
}

export default meta
type Story = StoryObj<typeof meta>

export const NotSelected: Story = {
  render: renderWithState(null),
}

export const MandateSepa: Story = {
  render: renderWithState(ConformityPaymentType.MandateSepa),
}

export const Other: Story = {
  render: renderWithState(ConformityPaymentType.Other),
}
