import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PTooltip from './PTooltip.vue'
import PButton from '../PButton'

// Storybook meta configuration for PTooltip
const meta: Meta<typeof PTooltip> = {
  title: 'Atoms/PTooltip',
  component: PTooltip,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Infobulle (tooltip) avec placements et délais d\'affichage/masquage.',
      },
    },
  },
  argTypes: {
    pContent: { control: 'text', description: 'Texte du tooltip' },
    disabled: { control: 'boolean', description: 'Désactiver le tooltip' },
    pPlacement: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
      description: 'Position du tooltip',
    },
    pShowAfter: { control: 'number', description: "Délai d'affichage (ms)" },
    pHideAfter: { control: 'number', description: 'Délai de masquage (ms)' },
  },
  args: {
    pContent: 'Astuce: cliquez pour en savoir plus',
    disabled: false,
    pPlacement: 'top',
    pShowAfter: 200,
    pHideAfter: 0,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PTooltip, PButton },
    setup() {
      return { args }
    },
    template: `
      <PTooltip v-bind="args">
        <PButton pType="primary">Survolez-moi</PButton>
      </PTooltip>
    `,
  }),
}

export const Placements: Story = {
  render: () => ({
    components: { PTooltip, PButton },
    template: `
      <div style="display:flex; gap: 16px; flex-wrap: wrap;">
        <PTooltip pContent="Haut" pPlacement="top"><PButton>top</PButton></PTooltip>
        <PTooltip pContent="Bas" pPlacement="bottom"><PButton>bottom</PButton></PTooltip>
        <PTooltip pContent="Gauche" pPlacement="left"><PButton>left</PButton></PTooltip>
        <PTooltip pContent="Droite" pPlacement="right"><PButton>right</PButton></PTooltip>
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
