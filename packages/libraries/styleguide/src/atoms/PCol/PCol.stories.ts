import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCol from './PCol.vue'
import PRow from '../PRow'

// Storybook meta configuration for PCol
const meta: Meta<typeof PCol> = {
  title: 'Atoms/PCol',
  component: PCol,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Colonne de grille (Col) basée sur Element Plus, gérant le span, l\'offset et les breakpoints.',
      },
    },
  },
  argTypes: {
    pSpan: { control: 'number', description: 'Nombre de colonnes à occuper (1-24)' },
    pOffset: { control: 'number', description: 'Décalage en colonnes' },
    pPush: { control: 'number', description: 'Décalage visuel vers la droite' },
    pPull: { control: 'number', description: 'Décalage visuel vers la gauche' },
    pXs: { control: 'object', description: 'Config XS (nombre ou objet)' },
    pSm: { control: 'object', description: 'Config SM (nombre ou objet)' },
    pMd: { control: 'object', description: 'Config MD (nombre ou objet)' },
    pLg: { control: 'object', description: 'Config LG (nombre ou objet)' },
    pXl: { control: 'object', description: 'Config XL (nombre ou objet)' },
    pTag: { control: 'text', description: 'Tag HTML du container' },
  },
  args: {
    pSpan: 8,
    pOffset: 0,
    pPush: 0,
    pPull: 0,
    pXs: undefined,
    pSm: undefined,
    pMd: undefined,
    pLg: undefined,
    pXl: undefined,
    pTag: 'div',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const boxStyle = 'background: #fde2e4; border: 1px dashed #f5a3a6; padding: 8px; text-align: center;'

export const Default: Story = {
  render: (args) => ({
    components: { PCol },
    setup() {
      return { args, boxStyle }
    },
    template: '<PCol v-bind="args"><div :style="boxStyle">Colonne</div></PCol>',
  }),
}

export const ResponsiveBreakpoints: Story = {
  args: { pSpan: 24, pSm: 12, pMd: 8, pLg: 6, pXl: 4 },
  render: (args) => ({
    components: { PCol, PRow },
    setup() {
      return { args, boxStyle }
    },
    template: `
      <PRow :pGutter="12">
        <PCol v-bind="args"><div :style="boxStyle">Responsive</div></PCol>
        <PCol v-bind="args"><div :style="boxStyle">Responsive</div></PCol>
        <PCol v-bind="args"><div :style="boxStyle">Responsive</div></PCol>
        <PCol v-bind="args"><div :style="boxStyle">Responsive</div></PCol>
      </PRow>
    `,
  }),
}
