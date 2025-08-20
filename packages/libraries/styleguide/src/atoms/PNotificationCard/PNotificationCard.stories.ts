import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PNotificationCard from './PNotificationCard.vue'

const meta: Meta<typeof PNotificationCard> = {
  title: 'Atoms/PNotificationCard',
  component: PNotificationCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A notification card component for displaying notification messages.',
      },
    },
  },
  argTypes: {
    pIsNew: {
      control: 'boolean',
      description: 'Whether the notification is new/unread',
    },
    pTime: {
      control: 'text',
      description: 'Time indication for the notification',
    },
  },
  args: {
    pIsNew: false,
    pTime: '1sem',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PNotificationCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #avatar>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #667EEA; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
              AB
            </div>
          </template>
          <template #text>
            <span style="font-weight: bold;">Alexandre De Lavandia</span> filed you a document <span style="font-weight: bold;">liasse-fiscale.pdf</span> inside the folder Publications.
          </template>
          <template #actions>
            <button style="padding: 4px;">⋮</button>
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}

export const NewNotification: Story = {
  args: {
    pIsNew: true,
    pTime: '1 min',
  },
  render: (args) => ({
    components: { PNotificationCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #avatar>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #667EEA; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
              AB
            </div>
          </template>
          <template #text>
            <span style="font-weight: bold;">Alexandre De Lavandia</span> filed you a document <span style="font-weight: bold;">liasse-fiscale.pdf</span> inside the folder Publications.
          </template>
          <template #actions>
            <button style="padding: 4px;">⋮</button>
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}

export const SimpleNotification: Story = {
  args: {
    pTime: '5 min',
  },
  render: (args) => ({
    components: { PNotificationCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #text>
            You have a new message
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}

export const LongTextNotification: Story = {
  args: {
    pIsNew: true,
    pTime: '30 min',
  },
  render: (args) => ({
    components: { PNotificationCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PNotificationCard v-bind="args">
          <template #avatar>
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #F56565; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
              JD
            </div>
          </template>
          <template #text>
            <span style="font-weight: bold;">John Doe</span> has shared multiple documents with you including quarterly reports, budget analysis, and strategic planning documents for the upcoming fiscal year.
          </template>
        </PNotificationCard>
      </div>
    `,
  }),
}
