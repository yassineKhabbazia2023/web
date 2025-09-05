import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorDisplay from './ColorDisplay.vue'
import { pegaseColors } from '../../design-system/pegase-colors.config'

const meta: Meta<typeof ColorDisplay> = {
  title: 'Guidelines/Colors/Pegase Colors',
  component: ColorDisplay,
  parameters: {
    docs: {
      description: {
        component: 'Couleurs primitives du design system Pégase. Ces couleurs constituent la palette de base et sont utilisées pour générer les tokens sémantiques.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorDisplay>

export const PegaseColors: Story = {
  args: {
    type: 'pegase',
    colors: pegaseColors,
  },
  parameters: {
    docs: {
      description: {
        story: 'Toutes les couleurs Pégase disponibles dans le design system. Cliquez sur une couleur pour copier sa variable CSS.',
      },
    },
  },
}
