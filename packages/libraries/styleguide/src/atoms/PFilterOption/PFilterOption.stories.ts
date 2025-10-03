import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PFilterOption from './PFilterOption.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

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
      options: [
        'success',
        'warning',
        'tranquil',
        'danger',
        'disabled',
        'light-gray',
        'gray',
        'light-blue',
      ],
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
