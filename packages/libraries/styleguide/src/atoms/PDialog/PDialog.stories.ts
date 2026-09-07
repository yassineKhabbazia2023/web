import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PDialog from './PDialog.vue'
import PButton from '../PButton'

// Storybook meta configuration for PDialog
const meta: Meta<typeof PDialog> = {
  title: 'Atoms/PDialog',
  component: PDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Boîte de dialogue personnalisée basée sur Element Plus, contrôlée via v-model.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'État ouvert/fermé (v-model)' },
    pTitle: { control: 'text', description: 'Titre du dialogue' },
    pWidth: { control: 'text', description: 'Largeur (ex: 40%, 480px)' },
    pModal: { control: 'boolean', description: 'Fond modal' },
    pCenter: { control: 'boolean', description: 'Titre centré' },
    pAlignCenter: { control: 'boolean', description: 'Contenu centré verticalement' },
    pLockScroll: { control: 'boolean', description: 'Empêcher le scroll du body' },
    pShowClose: { control: 'boolean', description: 'Afficher le bouton de fermeture' },
    pDestroyOnClose: { control: 'boolean', description: 'Détruire le contenu à la fermeture' },
    pCloseIconName: { control: 'text', description: 'Icône de fermeture (nom)' },
  },
  tags: ['!autodocs'],
  args: {
    modelValue: false,
    pTitle: 'Titre du dialogue',
    pWidth: '40%',
    pModal: true,
    pCenter: false,
    pAlignCenter: false,
    pLockScroll: false,
    pShowClose: true,
    pDestroyOnClose: false,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PDialog, PButton },
    setup() {
      const open = ref(false)
      return { args, open }
    },
    template: `
      <div>
        <PButton pType="primary" @click="open = true">Ouvrir le dialogue</PButton>
        <PDialog v-bind="args" v-model="open">
          Contenu du dialogue: votre message ici.
          <template #footer>
            <div style="display:flex; gap: 8px; justify-content: flex-end;">
              <PButton @click="open = false">Annuler</PButton>
              <PButton pType="primary" @click="open = false">Valider</PButton>
            </div>
          </template>
        </PDialog>
      </div>
    `,
  }),
}

export const CustomHeader: Story = {
  args: {
    pWidth: '480px',
    pTitle: 'Informations manquantes à renseigner',
  },
  parameters: {
    docs: {
      description: {
        story: 'Le slot #header remplace le rendu visuel du titre (ici bicolore) — pTitle reste renseigné avec l\'équivalent en texte brut, car c\'est lui qui alimente aria-label/aria-labelledby sur le dialogue.',
      },
    },
  },
  render: (args) => ({
    components: { PDialog, PButton },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: `
      <div>
        <PDialog v-bind="args" v-model="open">
          <template #header>
            <h2 style="margin: 0; font-size: 24px; font-weight: 600;">
              Informations manquantes
              <span style="color: var(--p-jungle-400);">à renseigner</span>
            </h2>
          </template>
          Contenu du dialogue: votre message ici.
        </PDialog>
      </div>
    `,
  }),
}

export const CenteredAndSmall: Story = {
  args: { pCenter: true, pWidth: '480px' },
  render: (args) => ({
    components: { PDialog, PButton },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: `
      <div>
        <PDialog v-bind="args" v-model="open">
          Dialogue centré avec largeur fixe.
        </PDialog>
      </div>
    `,
  }),
}
