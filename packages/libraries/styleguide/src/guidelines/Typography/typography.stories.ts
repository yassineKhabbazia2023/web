import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TypographySystem from './TypographySystem.vue'

const meta: Meta<typeof TypographySystem> = {
  title: 'Guidelines/Design System/Typography',
  component: TypographySystem,
  parameters: {
    docs: {
      description: {
        component: 'Système de typographie Pégase avec toutes les classes utilitaires pour les tailles, poids, styles, alignements et transformations de texte. Inclut une démonstration interactive pour tester les combinaisons.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof TypographySystem>

export const AllTypographyClasses: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète du système de typographie avec tous les groupes de classes, une section interactive pour tester les combinaisons, et un tableau de référence complet.',
      },
    },
  },
}
