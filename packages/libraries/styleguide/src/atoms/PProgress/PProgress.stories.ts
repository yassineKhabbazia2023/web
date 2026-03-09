import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PProgress from './PProgress.vue'

const meta: Meta<typeof PProgress> = {
  title: 'Atoms/PProgress',
  component: PProgress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Barre de progression avec label et pourcentage.',
      },
    },
  },
  argTypes: {
    pLabel: { control: 'text', description: 'Libelle de la progression' },
    pPercentage: { control: { type: 'number', min: 0, max: 100 }, description: 'Pourcentage de progression' },
  },
  args: {
    pLabel: 'Progression',
    pPercentage: 43,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PProgress },
    setup() {
      return { args }
    },
    template: '<div style="width: 400px;"><PProgress v-bind="args" /></div>',
  }),
}

export const AllStates: Story = {
  render: () => ({
    components: { PProgress },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 400px;">
        <PProgress pLabel="Vide" :pPercentage="0" />
        <PProgress pLabel="En cours" :pPercentage="43" />
        <PProgress pLabel="Termine" :pPercentage="100" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
