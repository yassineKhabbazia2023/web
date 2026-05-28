import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SpacingUtilities from './SpacingUtilities.vue'

const meta: Meta<typeof SpacingUtilities> = {
  title: 'Guidelines/Design System/Spacing',
  component: SpacingUtilities,
  parameters: {
    docs: {
      description: {
        component: 'Système d\'espacement Pégase basé sur la règle de 4 avec 16px comme unité de base. Inclut margins, paddings, dimensions et espacement négatif avec des tokens standardisés.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof SpacingUtilities>

export const AllSpacingUtilities: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète du système d\'espacement avec tous les types de margins, paddings, dimensions et leurs variantes directionnelles. Cliquez sur les exemples pour copier les classes CSS.',
      },
    },
  },
}
