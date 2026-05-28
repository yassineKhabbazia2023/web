import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PDoubleText from './PDoubleText.vue'

const meta: Meta<typeof PDoubleText> = {
  title: 'Atoms/PDoubleText',
  component: PDoubleText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Texte double (titre + description) avec avatar/icône et états (sélection, désactivé).',
      },
    },
  },
  argTypes: {
    pType: { control: 'select', options: ['primary', 'secondary'], description: 'Style du bloc' },
    pProfile: { control: 'text', description: 'Texte du profil (initiales)' },
    pIconName: { control: 'text', description: 'Nom d’icône (facultatif)' },
    pTitle: { control: 'text', description: 'Titre' },
    pContent: { control: 'text', description: 'Description' },
    pBold: { control: 'boolean', description: 'Titre en gras' },
    pSelected: { control: 'boolean', description: 'État sélectionné' },
    pDisabled: { control: 'boolean', description: 'État désactivé' },
  },
  args: {
    pType: 'primary',
    pProfile: 'AB',
    pTitle: 'Alexandre Bernard',
    pContent: 'Chef de projet — Équipe Plateforme',
    pBold: false,
    pSelected: false,
    pDisabled: false,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PDoubleText },
    setup: () => ({ args }),
    template: '<PDoubleText v-bind="args" />',
  }),
}

export const SecondarySelected: Story = {
  args: { pType: 'secondary', pSelected: true, pBold: true },
  render: (args) => ({
    components: { PDoubleText },
    setup: () => ({ args }),
    template: '<PDoubleText v-bind="args" pTitle="Dossier prioritaire" pContent="À traiter aujourd\'hui" />',
  }),
}

export const WithIconDisabled: Story = {
  args: { pIconName: 'folder', pDisabled: true },
  render: (args) => ({
    components: { PDoubleText },
    setup: () => ({ args }),
    template: '<PDoubleText v-bind="args" pTitle="Accès restreint" pContent="Permissions insuffisantes" />',
  }),
}
