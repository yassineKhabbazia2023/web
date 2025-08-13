import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PDrawer from './PDrawer.vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'

const meta: Meta<typeof PDrawer> = {
  title: 'Molecules/PDrawer',
  component: PDrawer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tiroir latéral avec en-tête personnalisable, navigation et pied de page optionnel.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'boolean', description: 'État ouvert/fermé' },
    pTitle: { control: 'text', description: 'Titre affiché dans l’en-tête' },
    pShowPreviousStep: { control: 'boolean', description: 'Affiche un bouton pour revenir à l’étape précédente' },
    pDirection: { control: 'select', options: ['rtl', 'ltr', 'ttb', 'btt'], description: 'Direction du tiroir' },
    pSize: { control: 'text', description: 'Taille du tiroir (px, %, etc.)' },
    pShowClose: { control: 'boolean', description: 'Affiche la croix de fermeture' },
    pWithHeader: { control: 'boolean', description: 'Affiche l’en-tête' },
    pType: { control: 'select', options: ['mini', 'fullscreen'], description: 'Variante visuelle' },
    pSuffixUnderTitle: { control: 'boolean', description: 'Place le suffixe sous le titre' },
    pHeaderToolbox: { control: false, description: 'Configuration de la toolbox dans l’en-tête' },
    pBreadcrumb: { control: false, description: 'Liste de fil d’Ariane (PBreadcrumb)' },
  },
  args: {
    modelValue: true,
    pTitle: 'Détails de l’élément',
    pShowPreviousStep: false,
    pDirection: 'rtl',
    pSize: '33%',
    pShowClose: false,
    pWithHeader: true,
    pType: undefined,
    pSuffixUnderTitle: false,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

// Basic drawer with header and footer
export const Basic: Story = {
  render: (args) => ({
    components: { PDrawer, PButton },
    setup() {
      const open = ref(args.modelValue)
      const close = () => (open.value = false)
      const openIt = () => (open.value = true)
      const breadcrumb = [
        { pId: 1, pText: 'Accueil' },
        { pId: 2, pText: 'Dossiers' },
        { pId: 3, pText: 'Sélection' },
      ]
      return { args, open, openIt, close, breadcrumb }
    },
    template: `
      <div>
        <PButton pType="primary" @click="openIt">Ouvrir le tiroir</PButton>
        <PDrawer v-bind="args" v-model="open" :pBreadcrumb="breadcrumb">
          <div style="padding: 16px;">
            Contenu du tiroir. Ajoutez vos composants ici.
          </div>
          <template #footer>
            <div style="display:flex; justify-content:flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--el-border-color);">
              <PButton pType="secondary" @click="open = false">Annuler</PButton>
              <PButton pType="primary">Valider</PButton>
            </div>
          </template>
        </PDrawer>
      </div>
    `,
  }),
}

// Top-to-bottom mini drawer
export const TopMini: Story = {
  args: { pDirection: 'ttb', pType: 'mini', pSize: 'auto' },
  render: (args) => ({
    components: { PDrawer, PButton },
    setup() {
      const open = ref(true)
      return { args, open }
    },
    template: `
      <div>
        <PDrawer v-bind="args" v-model="open">
          <div style="padding: 16px;">Tiroir compact en haut de page</div>
        </PDrawer>
      </div>
    `,
  }),
}

// With header toolbox
export const WithHeaderToolbox: Story = {
  args: {
    pHeaderToolbox: {
      pElements: [
        { pValue: 'edit', pIconName: 'pencilSquare' },
        { pValue: 'delete', pIconName: 'trash' },
      ],
    },
  },
  render: (args) => ({
    components: { PDrawer, PButton, PIcon },
    setup() {
      const open = ref(true)
      const lastAction = ref<string | null>(null)
      const onClick = (name: string) => (lastAction.value = name)
      return { args, open, onClick, lastAction }
    },
    template: `
      <div>
        <PDrawer v-bind="args" v-model="open" @p-toolbox-item-clicked="onClick">
          <div style="padding: 16px;">Utilisez la roue pour accéder aux actions</div>
          <div v-if="lastAction" style="padding: 0 16px 16px; color: var(--el-color-info);">
            Dernière action: {{ lastAction }}
          </div>
        </PDrawer>
      </div>
    `,
  }),
}
