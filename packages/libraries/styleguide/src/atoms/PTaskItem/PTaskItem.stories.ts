import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PTaskItem from './PTaskItem.vue'

// Storybook meta configuration for PTaskItem
const meta: Meta<typeof PTaskItem> = {
  title: 'Atoms/PTaskItem',
  component: PTaskItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ligne de tâche avec statut et compteur de sous-tâches.',
      },
    },
  },
  argTypes: {
    pTitle: { control: 'text', description: 'Titre de la tâche' },
    pStatus: { control: 'select', options: ['todo', 'disabled', 'done'], description: 'Statut de la tâche' },
    pCompletedTasks: { control: 'number', description: 'Nombre terminé' },
    pTotalTasks: { control: 'number', description: 'Nombre total' },
  },
  args: {
    pTitle: 'Appeler le client',
    pStatus: 'todo',
    pCompletedTasks: 0,
    pTotalTasks: 1,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PTaskItem },
    setup() {
      return { args }
    },
    template: '<div style="width: 280px;"><PTaskItem v-bind="args" /></div>',
  }),
}

export const AllStatuses: Story = {
  render: () => ({
    components: { PTaskItem },
    template: `
      <div style="display:flex; flex-direction: column; gap: 8px; width: 320px;">
        <PTaskItem pTitle="Terminé" pStatus="done" :pCompletedTasks="5" :pTotalTasks="5" />
        <PTaskItem pTitle="Désactivé" pStatus="disabled" :pCompletedTasks="0" :pTotalTasks="3" />
        <PTaskItem pTitle="À faire" pStatus="todo" :pCompletedTasks="1" :pTotalTasks="3" />
      </div>
    `,
  }),
  parameters: { controls: { disable: true } },
}
