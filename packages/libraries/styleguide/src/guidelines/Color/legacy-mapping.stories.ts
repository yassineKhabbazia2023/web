import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ColorDisplay from './ColorDisplay.vue'
import { legacyColorMappings } from '../../design-system/legacy-colors.config'

const meta: Meta<typeof ColorDisplay> = {
  title: 'Guidelines/Colors/Legacy Mapping',
  component: ColorDisplay,
  parameters: {
    docs: {
      description: {
        component: 'Correspondance entre les anciennes couleurs Element Plus et les nouvelles couleurs Pégase. Cette documentation aide à la migration progressive des composants.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<typeof ColorDisplay>

export const LegacyMapping: Story = {
  args: {
    type: 'legacy',
    colors: legacyColorMappings,
  },
  parameters: {
    docs: {
      description: {
        story: 'Mapping des anciennes variables CSS Element Plus vers les nouvelles couleurs Pégase. Les variables legacy sont maintenues pour la compatibilité avec les applets existantes.',
      },
    },
  },
}
