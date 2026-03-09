import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCompletionTrackerListItem from './PCompletionTrackerListItem.vue'

const meta: Meta<typeof PCompletionTrackerListItem> = {
  title: 'Atoms/PCompletionTrackerListItem',
  component: PCompletionTrackerListItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Element d\'une liste d\'etapes avec statut visuel (en attente, en cours, termine).',
      },
    },
  },
  argTypes: {
    pLabel: { control: 'text', description: 'Libelle de l\'etape' },
    pStatus: { control: 'select', options: ['pending', 'in-progress', 'completed'], description: 'Statut de l\'etape' },
    pSecondaryText: { control: 'text', description: 'Texte secondaire affiche a cote du libelle' },
  },
  args: {
    pLabel: 'Informations dirigeant',
    pStatus: 'pending',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PCompletionTrackerListItem },
    setup() {
      return { args }
    },
    template: '<div style="width: 400px;"><PCompletionTrackerListItem v-bind="args" /></div>',
  }),
}

export const AllStatuses: Story = {
  render: () => ({
    components: { PCompletionTrackerListItem },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 400px;">
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pStatus="pending" />
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pSecondaryText="Et texte secondaire sur deux lignes" pStatus="pending" />
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pStatus="in-progress" pSecondaryText="CNI manquante" />
        <PCompletionTrackerListItem pLabel="Longue information qui prend de la place" pSecondaryText="Et en plus j'ai pas tous les papiers prévus" pStatus="in-progress" />
        <PCompletionTrackerListItem pLabel="Informations Entité(s)" pStatus="completed" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
