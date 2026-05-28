import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PButtonGroup from './PButtonGroup.vue'
import PButton from '../PButton'

// Storybook meta configuration for PButtonGroup
const meta: Meta<typeof PButtonGroup> = {
  title: 'Atoms/PButtonGroup',
  component: PButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Groupe de boutons permettant de regrouper des actions connexes avec style et taille partagés.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Type des boutons du groupe',
    },
    pSize: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Taille des boutons du groupe',
    },
  },
  args: {
    pType: 'default',
    pSize: 'default',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PButtonGroup, PButton },
    setup() {
      return { args }
    },
    template: `
      <PButtonGroup v-bind="args">
        <PButton>Gauche</PButton>
        <PButton>Centre</PButton>
        <PButton>Droite</PButton>
      </PButtonGroup>
    `,
  }),
}

export const PrimarySmall: Story = {
  args: {
    pType: 'primary',
    pSize: 'small',
  },
  render: (args) => ({
    components: { PButtonGroup, PButton },
    setup() {
      return { args }
    },
    template: `
      <PButtonGroup v-bind="args">
        <PButton>Valider</PButton>
        <PButton>Dupliquer</PButton>
        <PButton>Supprimer</PButton>
      </PButtonGroup>
    `,
  }),
}
