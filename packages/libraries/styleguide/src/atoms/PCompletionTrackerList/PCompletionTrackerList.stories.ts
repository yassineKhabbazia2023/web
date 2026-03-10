import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCompletionTrackerList from './PCompletionTrackerList.vue'
import PCompletionTrackerListItem from '../PCompletionTrackerListItem/PCompletionTrackerListItem.vue'

const meta: Meta<typeof PCompletionTrackerList> = {
  title: 'Atoms/PCompletionTrackerList',
  component: PCompletionTrackerList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Groupe d\'etapes avec un titre et une liste d\'elements.',
      },
    },
  },
  argTypes: {
    pTitle: { control: 'text', description: 'Titre de la section' },
  },
  args: {
    pTitle: 'Les bases',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PCompletionTrackerList, PCompletionTrackerListItem },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 400px;">
        <PCompletionTrackerList v-bind="args">
          <PCompletionTrackerListItem pLabel="Informations dirigeant" pStatus="incomplete" pSecondaryText="CNI manquante" :pSelected="true" />
          <PCompletionTrackerListItem pLabel="Informations Entite(s)" pStatus="completed" />
          <PCompletionTrackerListItem pLabel="Vos documents administratifs" pStatus="incomplete" />
        </PCompletionTrackerList>
      </div>
    `,
  }),
}
