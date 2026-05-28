import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCHeader from './PCHeader.vue'

// Storybook meta configuration for PCHeader
const meta: Meta<typeof PCHeader> = {
  title: 'Atoms/PCHeader',
  component: PCHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'En-tête de conteneur basé sur Element Plus, permettant de définir une hauteur personnalisée.',
      },
    },
  },
  argTypes: {
    pHeight: {
      control: 'text',
      description: "Hauteur de l'en-tête (ex: '60px', '4rem')",
    },
  },
  args: {
    pHeight: '60px',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PCHeader },
    setup() {
      return { args }
    },
    template: `
      <PCHeader v-bind="args" style="background: var(--p-gray-50);">
        <div style="display:flex; align-items:center; height:100%; padding: 0 12px;">
          Contenu de l'en-tête
        </div>
      </PCHeader>
    `,
  }),
}

export const TallHeader: Story = {
  args: {
    pHeight: '96px',
  },
  render: (args) => ({
    components: { PCHeader },
    setup() {
      return { args }
    },
    template: `
      <PCHeader v-bind="args" style="background: var(--p-gray-50);">
        <div style="display:flex; align-items:center; height:100%; padding: 0 12px;">
          En-tête plus haut pour des contenus denses
        </div>
      </PCHeader>
    `,
  }),
}
