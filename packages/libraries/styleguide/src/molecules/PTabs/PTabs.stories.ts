import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PTabs from './PTabs.vue'
import PTabPane from '../../atoms/PTabPane'
import PPastille from '../../atoms/PPastille'

const meta: Meta<typeof PTabs> = {
  title: 'Molecules/PTabs',
  component: PTabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Onglets personnalisés avec variantes (texte, carte, icône) et options avancées.',
      },
    },
  },
  argTypes: {
    modelValue: { control: 'text', description: 'Nom de l’onglet actif' },
    pType: { control: 'select', options: ['', 'card', 'border-card', 'icon'], description: 'Style des onglets' },
    pClosable: { control: 'boolean', description: 'Active la fermeture des onglets' },
    pAddable: { control: 'boolean', description: 'Affiche le bouton d’ajout' },
    pEditable: { control: 'boolean', description: 'Active l’édition (ajout/suppression)' },
    pTabPosition: { control: 'select', options: ['top', 'right', 'bottom', 'left'], description: 'Position des onglets' },
    pStretch: { control: 'boolean', description: 'Etire les onglets pour occuper toute la largeur' },
    pBeforeLeave: { control: false, description: 'Hook asynchrone avant de quitter un onglet' },
  },
  args: {
    modelValue: '1',
    pType: '',
    pClosable: false,
    pAddable: false,
    pEditable: false,
    pTabPosition: 'top',
    pStretch: false,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

// Basic text tabs
export const Basic: Story = {
  render: (args) => ({
    components: { PTabs, PTabPane },
    setup() {
      const active = ref(args.modelValue)
      const onUpdate = (v: string) => (active.value = v)
      return { args, active, onUpdate }
    },
    template: `
      <div style="width: 640px;">
        <PTabs v-bind="args" v-model="active" @update:model-value="onUpdate">
          <PTabPane pLabel="Onglet A" pName="1">Contenu A</PTabPane>
          <PTabPane pLabel="Onglet B" pName="2">Contenu B</PTabPane>
          <PTabPane pLabel="Onglet C" pName="3">Contenu C</PTabPane>
        </PTabs>
      </div>
    `,
  }),
}

// Card variant
export const Card: Story = {
  args: { pType: 'card' },
  render: () => ({
    components: { PTabs, PTabPane },
    template: `
      <div style="width: 640px;">
        <PTabs>
          <PTabPane pLabel="Résumé" pName="1">Vue d’ensemble</PTabPane>
          <PTabPane pLabel="Détails" pName="2">Informations détaillées</PTabPane>
          <PTabPane pLabel="Historique" pName="3">Historique des actions</PTabPane>
        </PTabs>
      </div>
    `,
  }),
}

// Icon variant with counter using PPastille
export const WithIconsAndCounters: Story = {
  args: { pType: 'icon' },
  render: () => ({
    components: { PTabs, PTabPane, PPastille },
    template: `
      <div style="width: 640px;">
        <PTabs pType="icon">
          <PTabPane pName="1" pIconName="calendarEvent">
            <template #label>
              <span>Agenda</span>
              <PPastille size="small" kind="persian" class="margin-left--2">3</PPastille>
            </template>
            Prochaines échéances
          </PTabPane>
          <PTabPane pName="2" pIconName="envelope">
            <template #label>
              <span>Messages</span>
              <PPastille size="small" kind="persian" class="margin-left--2">12</PPastille>
            </template>
            Messages récents
          </PTabPane>
          <PTabPane pName="3" pIconName="gear">Paramètres</PTabPane>
        </PTabs>
      </div>
    `,
  }),
}
