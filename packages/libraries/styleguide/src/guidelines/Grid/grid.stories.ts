import type { Meta, StoryObj } from '@storybook/vue3-vite'
import GridUtilities from './GridUtilities.vue'

const meta: Meta<typeof GridUtilities> = {
  title: 'Guidelines/Design System/CSS Grid',
  component: GridUtilities,
  parameters: {
    docs: {
      description: {
        component: 'Système CSS Grid Pégase avec classes utilitaires pour colonnes, spans, direction et responsive. Inclut des contrôles interactifs pour tester les différentes configurations de grille.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof GridUtilities>

export const AllGridUtilities: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète du système CSS Grid avec exemples de grilles de base, spans de colonnes/lignes, et grilles responsives. Utilisez les contrôles pour tester différentes configurations.',
      },
    },
  },
}
