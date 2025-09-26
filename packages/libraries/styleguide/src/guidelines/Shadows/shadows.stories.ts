import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ShadowDisplay from './ShadowDisplay.vue'

const meta: Meta<typeof ShadowDisplay> = {
  title: 'Guidelines/Design System/Shadows',
  component: ShadowDisplay,
  parameters: {
    docs: {
      description: {
        component: 'Système d\'ombres Pégase avec 6 niveaux d\'élévation pour créer une hiérarchie visuelle claire. Les ombres utilisent la couleur #7090b0 avec différents niveaux d\'opacité et de flou.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof ShadowDisplay>

export const AllShadows: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Démonstration complète des 6 niveaux d\'ombres disponibles dans le design system Pégase. Chaque niveau a un usage spécifique selon l\'élévation souhaitée.',
      },
    },
  },
}
