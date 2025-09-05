import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorDisplay from './ColorDisplay.vue'
import { figmaProxyTokens } from '../../design-system/pegase-colors.config'

const meta: Meta<typeof ColorDisplay> = {
  title: 'Guidelines/Colors/Figma Tokens',
  component: ColorDisplay,
  parameters: {
    docs: {
      description: {
        component: 'Tokens sémantiques Figma utilisés pour l\'interface utilisateur. Ces tokens sont mappés sur les couleurs Pégase et fournissent une couche d\'abstraction sémantique.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorDisplay>

export const FigmaTokens: Story = {
  args: {
    type: 'tokens',
    colors: figmaProxyTokens,
  },
  parameters: {
    docs: {
      description: {
        story: 'Tokens sémantiques Figma mappés sur les couleurs Pégase. Utilisez ces variables pour maintenir la cohérence sémantique dans vos composants.',
      },
    },
  },
}
