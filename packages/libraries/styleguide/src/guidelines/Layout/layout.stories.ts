import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LayoutSystem from './LayoutSystem.vue'

const meta: Meta<typeof LayoutSystem> = {
  title: 'Guidelines/Design System/Layout System',
  component: LayoutSystem,
  parameters: {
    docs: {
      description: {
        component: 'Système de layout Pégase basé sur une grille et des tokens d\'espacement standardisés. Inclut les valeurs d\'espacement, breakpoints, et une démonstration interactive du système de colonnes avec les composants PRow et PCol.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof LayoutSystem>

export const LayoutSystemDemo: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète du système de layout avec les tokens d\'espacement, breakpoints responsive, et contrôles interactifs pour tester les différentes configurations de grille.',
      },
    },
  },
}
