import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCompletionTrackerListItem from './PCompletionTrackerListItem.vue'
import type { PCompletionTrackerListItemStatus } from './PCompletionTrackerListItemTypes'

const statusOptions: PCompletionTrackerListItemStatus[] = ['incomplete', 'completed']

const meta: Meta<typeof PCompletionTrackerListItem> = {
  title: 'Atoms/PCompletionTrackerListItem',
  component: PCompletionTrackerListItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Élément d\'une liste d\'étapes avec statut visuel (incomplete, completed) et état sélectionné.',
      },
    },
  },
  argTypes: {
    pLabel: { control: 'text', description: 'Libellé de l\'étape' },
    pStatus: { control: 'select', options: statusOptions, description: 'Statut de l\'étape' },
    pSelected: { control: 'boolean', description: 'Si l\'étape est sélectionnée' },
    pSecondaryText: { control: 'text', description: 'Texte secondaire affiché à côté du libellé' },
  },
  args: {
    pLabel: 'Informations dirigeant',
    pStatus: 'incomplete',
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
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pStatus="incomplete" />
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pStatus="incomplete" :pSelected="true" />
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pSecondaryText="CNI manquante" pStatus="incomplete" />
        <PCompletionTrackerListItem pLabel="Informations dirigeant" pSecondaryText="CNI manquante" pStatus="incomplete" :pSelected="true" />
        <PCompletionTrackerListItem pLabel="Informations Entité(s)" pStatus="completed" />
        <PCompletionTrackerListItem pLabel="Informations Entité(s)" pStatus="completed" :pSelected="true" />
        <PCompletionTrackerListItem pLabel="Longue information qui prend de la place" pSecondaryText="Et en plus j'ai pas tous les papiers prévus" pStatus="incomplete" :pSelected="true" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
