import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PDatePicker from './PDatePicker.vue'

const meta: Meta<typeof PDatePicker> = {
  title: 'Atoms/PDatePicker',
  component: PDatePicker as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Sélecteur de date/intervalle avec options avancées et mode calendrier compact.',
      },
    },
  },
  argTypes: {
    pType: { control: 'select', options: ['date', 'daterange', 'month', 'year', 'week'], description: 'Type de sélection' },
    pPlaceholder: { control: 'text', description: 'Texte indicatif' },
    pStartPlaceholder: { control: 'text', description: 'Placeholder début (intervalle)' },
    pEndPlaceholder: { control: 'text', description: 'Placeholder fin (intervalle)' },
    pFormat: { control: 'text', description: 'Format d’affichage' },
    pClearable: { control: 'boolean', description: 'Bouton d’effacement' },
    pDisabled: { control: 'boolean', description: 'Désactive le champ' },
    pCalendarLite: { control: 'boolean', description: 'Affiche un calendrier compact' },
  },
  args: {
    pType: 'date',
    pPlaceholder: 'Choisir une date',
    pFormat: 'YYYY-MM-DD',
    pClearable: true,
    pDisabled: false,
    pCalendarLite: false,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const SingleDate: Story = {
  render: (args) => ({
    components: { PDatePicker },
    setup() {
      const value = ref<string>('')
      return { args, value }
    },
    template: '<PDatePicker v-bind="args" v-model="value" />',
  }),
}

export const Range: Story = {
  args: { pType: 'daterange', pStartPlaceholder: 'Début', pEndPlaceholder: 'Fin' },
  render: (args) => ({
    components: { PDatePicker },
    setup() {
      const value = ref<[Date, Date] | string>('')
      return { args, value }
    },
    template: '<PDatePicker v-bind="args" v-model="value" />',
  }),
}

export const CompactCalendar: Story = {
  args: { pCalendarLite: true },
  render: (args) => ({
    components: { PDatePicker },
    setup() {
      const value = ref<string>('')
      return { args, value }
    },
    template: `
      <div style="width: 320px;">
        <PDatePicker v-bind="args" v-model="value" />
      </div>
    `,
  }),
}
