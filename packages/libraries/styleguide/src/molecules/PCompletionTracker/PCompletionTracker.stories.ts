import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import PCompletionTracker from './PCompletionTracker.vue'
import PCompletionTrackerList from '../../atoms/PCompletionTrackerList/PCompletionTrackerList.vue'
import PCompletionTrackerListItem from '../../atoms/PCompletionTrackerListItem/PCompletionTrackerListItem.vue'
import type { PCompletionTrackerListItemStatus } from '../../atoms/PCompletionTrackerListItem/PCompletionTrackerListItemTypes'

interface StepItem {
  id: string
  label: string
  baseStatus: PCompletionTrackerListItemStatus
  secondaryText?: string
  section: string
}

const meta: Meta<typeof PCompletionTracker> = {
  title: 'Molecules/PCompletionTracker',
  component: PCompletionTracker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de suivi d\'etapes avec barre de progression et listes d\'actions.',
      },
    },
  },
  argTypes: {
    pCurrent: { control: 'number', description: 'Nombre d\'etapes completees' },
    pTotal: { control: 'number', description: 'Nombre total d\'etapes' },
    pProgressionLabel: { control: 'text', description: 'Libelle de la barre de progression' },
  },
  args: {
    pCurrent: 3,
    pTotal: 7,
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PCompletionTracker, PCompletionTrackerList, PCompletionTrackerListItem },
    setup() {
      const selectedId = ref('director-info')

      const steps = ref<StepItem[]>([
        { id: 'director-info', label: 'Informations dirigeant', baseStatus: 'pending', secondaryText: 'CNI manquante', section: 'bases' },
        { id: 'entity-info', label: 'Informations Entité(s)', baseStatus: 'completed', section: 'bases' },
        { id: 'admin-docs', label: 'Vos documents administratifs', baseStatus: 'pending', section: 'documents' },
        { id: 'sepa', label: 'Mandat SEPA', baseStatus: 'pending', secondaryText: 'A réaliser', section: 'documents' },
      ])

      const getStatus = (step: StepItem): PCompletionTrackerListItemStatus => {
        if (step.baseStatus === 'completed') {
          return 'completed'
        }
        return selectedId.value === step.id ? 'in-progress' : 'pending'
      }

      const baseSteps = computed(() => steps.value.filter((s) => s.section === 'bases'))
      const documentSteps = computed(() => steps.value.filter((s) => s.section === 'documents'))

      return { args, selectedId, baseSteps, documentSteps, getStatus }
    },
    template: `
      <div style="width: 440px;">
        <PCompletionTracker v-bind="args">
          <template #header>
            <h3 style="margin: 0;">Etapes</h3>
            <p style="margin: 4px 0 0;">Suivez votre accompagnement etape par etape.</p>
          </template>

          <PCompletionTrackerList pTitle="Les bases">
            <PCompletionTrackerListItem
              v-for="step in baseSteps"
              :key="step.id"
              :pLabel="step.label"
              :pStatus="getStatus(step)"
              :pSelected="selectedId === step.id"
              :pSecondaryText="step.secondaryText"
              @select="selectedId = step.id"
            />
          </PCompletionTrackerList>

          <PCompletionTrackerList pTitle="Les documents">
            <PCompletionTrackerListItem
              v-for="step in documentSteps"
              :key="step.id"
              :pLabel="step.label"
              :pStatus="getStatus(step)"
              :pSelected="selectedId === step.id"
              :pSecondaryText="step.secondaryText"
              @select="selectedId = step.id"
            />
          </PCompletionTrackerList>
        </PCompletionTracker>
      </div>
    `,
  }),
}
