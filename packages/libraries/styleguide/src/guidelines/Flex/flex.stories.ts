import type { Meta, StoryObj } from '@storybook/vue3-vite'
import FlexUtilities from './FlexUtilities.vue'

const meta: Meta<typeof FlexUtilities> = {
  title: 'Guidelines/Design System/Flexbox',
  component: FlexUtilities,
  parameters: {
    docs: {
      description: {
        component: 'Système Flexbox Pégase avec toutes les classes utilitaires pour justify-content, align-items, gap, et les propriétés individuelles des éléments flex. Inclut un mode colonne interactif pour tester les deux directions.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof FlexUtilities>

export const AllFlexUtilities: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète du système Flexbox avec exemples visuels interactifs. Cliquez sur les exemples pour copier les classes CSS. Utilisez la checkbox pour basculer en mode colonne.',
      },
    },
  },
}
