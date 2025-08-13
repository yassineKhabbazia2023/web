import type { Meta, StoryObj } from '@storybook/vue3-vite'
import dayjs from 'dayjs'
import type { CalendarCellItemProps } from './PCalendarDateCellTypes'
import PCalendarDateCell from './PCalendarDateCell.vue'

// Helper data for tasks inside a cell
const sampleElements: CalendarCellItemProps[] = [
  { pItemId: 1, pTitle: 'Appeler le client', pStatus: 'todo', pCompletedTasks: 0, pTotalTasks: 1 },
  { pItemId: 2, pTitle: 'Préparer devis', pStatus: 'done', pCompletedTasks: 1, pTotalTasks: 1 },
  { pItemId: 3, pTitle: 'Envoyer email', pStatus: 'disabled', pCompletedTasks: 0, pTotalTasks: 2 },
]

const today = dayjs().startOf('day')

// Storybook meta configuration for PCalendarDateCell
const meta: Meta<typeof PCalendarDateCell> = {
  title: 'Atoms/PCalendarDateCell',
  component: PCalendarDateCell,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cellule de calendrier affichant le numéro de jour et une liste d’éléments (tâches).',
      },
    },
  },
  argTypes: {
    pActiveDate: { control: 'text', description: 'Date active ISO (AAAA-MM-JJ)' },
    pCurrentDate: { control: 'text', description: 'Date du jour ISO' },
    pCellDate: { control: 'text', description: 'Date de la cellule ISO' },
    pCellElements: { control: 'object', description: 'Éléments affichés (tâches)' },
    pCellType: {
      control: 'radio',
      options: ['prev-month', 'next-month', 'current-month'],
      description: 'Type de cellule dans le calendrier',
    },
  },
  args: {
    pActiveDate: today.toISOString(),
    pCurrentDate: today.toISOString(),
    pCellDate: today.toISOString(),
    pCellElements: sampleElements,
    pCellType: 'current-month',
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PCalendarDateCell },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 220px; height: 160px; border: 1px solid var(--el-border-color);">
        <PCalendarDateCell v-bind="args" />
      </div>
    `,
  }),
}

export const ManyItems: Story = {
  args: {
    pCellElements: [
      ...sampleElements,
      { pItemId: 4, pTitle: 'Relancer fournisseur', pStatus: 'todo', pCompletedTasks: 0, pTotalTasks: 3 },
      { pItemId: 5, pTitle: 'Contrôler paiement', pStatus: 'todo', pCompletedTasks: 0, pTotalTasks: 1 },
      { pItemId: 6, pTitle: 'Vérifier pièces jointes', pStatus: 'todo', pCompletedTasks: 0, pTotalTasks: 1 },
      { pItemId: 7, pTitle: 'Planifier rendez-vous', pStatus: 'todo', pCompletedTasks: 0, pTotalTasks: 1 },
    ],
  },
  render: (args) => ({
    components: { PCalendarDateCell },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 220px; height: 160px; border: 1px solid var(--el-border-color);">
        <PCalendarDateCell v-bind="args" />
      </div>
    `,
  }),
}

export const PreviousMonthCell: Story = {
  args: {
    pCellDate: today.subtract(1, 'month').toISOString(),
    pCellType: 'prev-month',
  },
  render: (args) => ({
    components: { PCalendarDateCell },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 220px; height: 160px; border: 1px solid var(--el-border-color);">
        <PCalendarDateCell v-bind="args" />
      </div>
    `,
  }),
}

export const NextMonthCell: Story = {
  args: {
    pCellDate: today.add(1, 'month').toISOString(),
    pCellType: 'next-month',
  },
  render: (args) => ({
    components: { PCalendarDateCell },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 220px; height: 160px; border: 1px solid var(--el-border-color);">
        <PCalendarDateCell v-bind="args" />
      </div>
    `,
  }),
}
