import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PRow from './PRow.vue'
import PCol from '../PCol'

// Storybook meta configuration for PRow
const meta: Meta<typeof PRow> = {
  title: 'Atoms/PRow',
  component: PRow,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Ligne de grille (Row) basée sur Element Plus, gérant l\'espacement et l\'alignement.',
      },
    },
  },
  argTypes: {
    pGutter: { control: 'number', description: 'Espacement horizontal (px) entre colonnes' },
    pJustify: {
      control: 'select',
      options: ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'],
      description: 'Justification du contenu',
    },
    pAlign: { control: 'select', options: ['top', 'middle', 'bottom'], description: 'Alignement vertical' },
    pTag: { control: 'text', description: 'Tag HTML du container' },
  },
  args: {
    pGutter: 12,
    pJustify: 'start',
    pAlign: undefined,
    pTag: 'div',
  },
}

export default meta

type Story = StoryObj<typeof meta>

const boxStyle = 'background: #e6f2ff; border: 1px dashed #84a9c0; padding: 8px; text-align: center;'

export const Default: Story = {
  render: (args) => ({
    components: { PRow, PCol },
    setup() {
      return { args, boxStyle }
    },
    template: `
      <PRow v-bind="args">
        <PCol :pSpan="8"><div :style="boxStyle">Span 8</div></PCol>
        <PCol :pSpan="8"><div :style="boxStyle">Span 8</div></PCol>
        <PCol :pSpan="8"><div :style="boxStyle">Span 8</div></PCol>
      </PRow>
    `,
  }),
}

export const JustifyAndAlign: Story = {
  args: { pJustify: 'space-between', pAlign: 'middle', pGutter: 16 },
  render: (args) => ({
    components: { PRow, PCol },
    setup() {
      return { args, boxStyle }
    },
    template: `
      <PRow v-bind="args" style="height: 80px; background: #fafafa;">
        <PCol :pSpan="6"><div :style="boxStyle">A</div></PCol>
        <PCol :pSpan="6"><div :style="boxStyle">B</div></PCol>
        <PCol :pSpan="6"><div :style="boxStyle">C</div></PCol>
      </PRow>
    `,
  }),
}
