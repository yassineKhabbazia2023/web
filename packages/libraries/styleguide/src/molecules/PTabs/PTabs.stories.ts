import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PTabs from './PTabs.vue'
import PTabPane from '../../atoms/PTabPane'
import type { PTabsProps } from './PTabsTypes'

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
    pType: { control: 'select', options: ['', 'card', 'icon'], description: 'Style des onglets' },
    pTabPosition: { control: 'select', options: ['top', 'right', 'bottom', 'left'], description: 'Position des onglets' },
    pStretch: { control: 'boolean', description: 'Etire les onglets pour occuper toute la largeur' },
    pBeforeLeave: { control: false, description: 'Hook asynchrone avant de quitter un onglet' },
  },
  args: {
    modelValue: '1',
    pType: '',
    pTabPosition: 'top',
    pStretch: false,
  },
}

export default meta
export type Story = StoryObj<PTabsProps>

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

// Tabs with counter
export const WithCounter: Story = {
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
          <PTabPane pLabel="Option A" pName="1" :pCount="12">Option A</PTabPane>
          <PTabPane pLabel="Option B" pName="2" :pCount="123">Option B</PTabPane>
          <PTabPane pLabel="Option C" pName="3" :pCount="1">Option C</PTabPane>
        </PTabs>
      </div>
    `,
  }),
}

// Card variant
export const Card: Story = {
  render: (args) => ({
    components: { PTabs, PTabPane },
    setup() {
      const active = ref(args.modelValue)
      const onUpdate = (v: string) => (active.value = v)
      return { args, active, onUpdate }
    },
    template: `
      <div style="width: 640px;">
        <PTabs v-bind="args" v-model="active" @update:model-value="onUpdate" pType="card">
          <PTabPane pLabel="Résumé" pName="1">Vue d’ensemble</PTabPane>
          <PTabPane pLabel="Détails" pName="2">Informations détaillées</PTabPane>
          <PTabPane pLabel="Historique" pName="3">Historique des actions</PTabPane>
        </PTabs>
      </div>
    `,
  }),
}

// Icon variant with counter using Tooltip
export const WithIconsAndTooltip: Story = {
  render: (args) => ({
    components: { PTabs, PTabPane },
    setup() {
      const active = ref(args.modelValue)
      const onUpdate = (v: string) => (active.value = v)
      return { args, active, onUpdate }
    },
    template: `
      <div style="width: 640px;">
        <PTabs v-bind="args" v-model="active" @update:model-value="onUpdate" pType="icon">
          <PTabPane pName="1" pIconName="calendarEvent" :pTooltip="{
            pPlacement: 'bottom',
            pContent: 'Agenda',
            disabled: false,
          }">
            Prochaines échéances
          </PTabPane>
          <PTabPane pName="2" pIconName="envelope" :pTooltip="{
            pPlacement: 'top',
            pContent: 'Messages',
            disabled: false,
          }">
            Messages récents
          </PTabPane>
          <PTabPane pName="3" pIconName="gear" :pTooltip="{
            pPlacement: 'right',
            pContent: 'Paramètres',
            disabled: false,
          }">Paramètres</PTabPane>
        </PTabs>
      </div>
    `,
  }),
}
