import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PSkewedButton from './PSkewedButton.vue'

const meta: Meta<typeof PSkewedButton> = {
  title: 'Atoms/PSkewedButton',
  component: PSkewedButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Bouton incliné avec deux variantes (primaire/secondaire) et états (chargement, désactivé).',
      },
    },
  },
  argTypes: {
    pType: { control: 'select', options: ['primary', 'secondary'], description: 'Style du bouton' },
    pDisabled: { control: 'boolean', description: 'Désactive le bouton' },
    pContent: { control: 'text', description: 'Texte du bouton' },
    pHasLoader: { control: 'boolean', description: 'Affiche un indicateur de chargement' },
  },
  args: {
    pType: 'primary',
    pContent: 'Continuer',
    pDisabled: false,
    pHasLoader: false,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => ({
    components: { PSkewedButton },
    setup: () => ({ args }),
    template: '<PSkewedButton v-bind="args" />',
  }),
}

export const Secondary: Story = {
  args: { pType: 'secondary', pContent: 'Options' },
  render: (args) => ({
    components: { PSkewedButton },
    setup: () => ({ args }),
    template: '<PSkewedButton v-bind="args" />',
  }),
}

export const DisabledWithLoader: Story = {
  args: { pDisabled: true, pHasLoader: true, pContent: 'Chargement…' },
  render: (args) => ({
    components: { PSkewedButton },
    setup: () => ({ args }),
    template: '<PSkewedButton v-bind="args" />',
  }),
}
