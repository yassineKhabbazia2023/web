import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCalendarCellNumber from './PCalendarCellNumber.vue'

// Storybook meta configuration for PCalendarCellNumber
const meta: Meta<typeof PCalendarCellNumber> = {
  title: 'Atoms/PCalendarCellNumber',
  component: PCalendarCellNumber,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Affiche un numéro de jour avec un état visuel (initial, inactif, actif, courant).',
      },
    },
  },
  argTypes: {
    pNumber: { control: 'text', description: 'Numéro à afficher (jour)' },
    pState: {
      control: 'select',
      options: ['initial', 'inactive', 'active', 'current'],
      description: 'État visuel du jour',
    },
  },
  args: {
    pNumber: 12,
    pState: 'initial',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PCalendarCellNumber },
    setup() {
      return { args }
    },
    template: '<PCalendarCellNumber v-bind="args" />',
  }),
}

export const States: Story = {
  render: () => ({
    components: { PCalendarCellNumber },
    template: `
      <div style="display:flex; gap: 8px;">
        <PCalendarCellNumber :pNumber="10" pState="initial" />
        <PCalendarCellNumber :pNumber="11" pState="inactive" />
        <PCalendarCellNumber :pNumber="12" pState="active" />
        <PCalendarCellNumber :pNumber="13" pState="current" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
