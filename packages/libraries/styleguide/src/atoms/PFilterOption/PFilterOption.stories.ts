import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PFilterOption from './PFilterOption.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

const colorOptions = [
  'default',
  'success',
  'warning',
  'danger',
  'light-green',
  'light-blue',
  'blue',
  'tranquil',
  'purple',
  'disabled',
  'light-gray',
  'gray',
] as const

const meta: Meta<typeof PFilterOption> = {
  title: 'Atoms/PFilterOption',
  component: PFilterOption as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Option de filtre avec compteur, couleur et icône.',
      },
    },
  }, argTypes: {
    pValue: {
      control: 'text',
      description: 'Nombre à afficher',
    },
    pContent: {
      control: 'text',
      description: 'Texte à afficher',
    },
    pIconName: {
      control: 'select',
      options: [undefined, ...pulseGeneratedIcons.map(icon => icon.name)],
      description: 'Nom de l\'icône à afficher dans le filtre',
    },
    pColor: {
      control: 'select',
      description: 'Couleur du filtre',
      options: colorOptions,
    },
    pSelected: { control: 'boolean', description: 'État sélectionné' },
    pDisabled: { control: 'boolean', description: 'État désactivé' },
  },
  args: {
    pValue: '9',
    pContent: 'A Déployer',
    pSelected: false,
    pColor: 'success',
    pDisabled: false,
    pIconName: 'arrowUpCircle',
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PFilterOption },
    setup: () => ({ args }),
    template: `
      <div style="padding: 16px;">
        <PFilterOption v-bind="args" v-model:pSelected="args.pSelected"/>
      </div>
    `,
  }),
}

export const AllColors: Story = {
  render: () => ({
    components: { PFilterOption },
    setup: () => ({ colorOptions }),
    template: `
      <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
        <PFilterOption
          v-for="color in colorOptions"
          :key="color"
          :pColor="color"
          :pContent="color"
          :pValue="3"
          pIconName="infoCircle"
        />
      </div>
    `,
  }),
}

export const AllColorsSelected: Story = {
  render: () => ({
    components: { PFilterOption },
    setup: () => ({ colorOptions }),
    template: `
      <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
        <PFilterOption
          v-for="color in colorOptions"
          :key="color"
          :pColor="color"
          :pContent="color"
          :pValue="3"
          pIconName="infoCircle"
          pSelected
        />
      </div>
    `,
  }),
}
