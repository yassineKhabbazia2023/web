import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, onMounted, ref } from 'vue'
import PCompletionTracker from '../../molecules/PCompletionTracker/PCompletionTracker.vue'
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

const meta: Meta = {
  title: 'Laboratory/CompletionTracker',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Playground demonstrating PCompletionTracker with scrollable content and anchor navigation.',
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta

type Story = StoryObj

export const WithScrollableContent: Story = {
  render: () => ({
    components: { PCompletionTracker, PCompletionTrackerList, PCompletionTrackerListItem },
    setup() {
      const steps = ref<StepItem[]>([
        { id: 'director-info', label: 'Informations dirigeants', baseStatus: 'incomplete', section: 'bases' },
        { id: 'entity-info', label: 'Information entité', baseStatus: 'completed', section: 'bases' },
        { id: 'supporting-docs', label: 'Documents justificatifs', baseStatus: 'incomplete', secondaryText: '0/3', section: 'documents' },
        { id: 'commercial-proposal', label: 'Proposition commerciale', baseStatus: 'incomplete', secondaryText: 'à venir', section: 'documents' },
        { id: 'sepa', label: 'Mandat SEPA', baseStatus: 'incomplete', secondaryText: 'à réaliser', section: 'documents' },
        { id: 'mission-letter', label: 'Lettre de mission', baseStatus: 'incomplete', secondaryText: 'à venir', section: 'relation' },
      ])

      const getTopWindow = (): Window => {
        try {
          return window.top ?? window
        } catch {
          return window
        }
      }

      const initialHash = getTopWindow().location.hash.replace('#', '')
      const initialId = steps.value.some((s) => s.id === initialHash) ? initialHash : 'director-info'
      const selectedId = ref(initialId)

      onMounted(() => {
        if (initialHash !== '') {
          const element = document.getElementById(`step-${initialHash}`)
          if (element !== null) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }
      })

      const getStatus = (step: StepItem): PCompletionTrackerListItemStatus => {
        return step.baseStatus
      }

      const baseSteps = computed(() => steps.value.filter((s) => s.section === 'bases'))
      const documentSteps = computed(() => steps.value.filter((s) => s.section === 'documents'))
      const relationSteps = computed(() => steps.value.filter((s) => s.section === 'relation'))

      const pCurrent = computed(() => steps.value.filter((s) => s.baseStatus === 'completed').length)
      const pTotal = computed(() => steps.value.length)

      const onStepClick = (stepId: string) => {
        selectedId.value = stepId
        getTopWindow().location.hash = stepId
        const element = document.getElementById(`step-${stepId}`)
        if (element !== null) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }

      return { selectedId, steps, baseSteps, documentSteps, relationSteps, getStatus, pCurrent, pTotal, onStepClick }
    },
    template: `
      <div style="display: flex; height: 100vh; overflow: hidden;">
        <div style="width: 340px; flex-shrink: 0; overflow-y: auto;">
          <PCompletionTracker
            :pCurrent="pCurrent"
            :pTotal="pTotal"
            pTitle="Étapes"
            pDescription="Cet espace vous permet de suivre simplement votre accompagnement, de compléter les informations nécessaires et d'avancer étape par étape avec votre expert."
          >

            <PCompletionTrackerList pTitle="Les bases">
              <PCompletionTrackerListItem
                v-for="step in baseSteps"
                :key="step.id"
                :pLabel="step.label"
                :pStatus="getStatus(step)"
                :pSelected="selectedId === step.id"
                :pSecondaryText="step.secondaryText"
                @select="onStepClick(step.id)"
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
                @select="onStepClick(step.id)"
              />
            </PCompletionTrackerList>

            <PCompletionTrackerList pTitle="Commencer la relation">
              <PCompletionTrackerListItem
                v-for="step in relationSteps"
                :key="step.id"
                :pLabel="step.label"
                :pStatus="getStatus(step)"
                :pSelected="selectedId === step.id"
                :pSecondaryText="step.secondaryText"
                @select="onStepClick(step.id)"
              />
            </PCompletionTrackerList>
          </PCompletionTracker>
        </div>

        <div style="flex: 1; overflow-y: auto; padding: 24px; background: #fafafa;">
          <div
            v-for="step in steps"
            :key="step.id"
            :id="'step-' + step.id"
            style="min-height: 400px; margin-bottom: 24px; padding: 32px; border-radius: 8px; border: 1px solid var(--p-gray-200); background: white;"
          >
            <h2 style="margin: 0 0 12px;">{{ step.label }}</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Ceci est l'écran de l'étape « {{ step.label }} ».<br />
              Cliquez sur une étape dans le tracker à gauche pour naviguer ici.
            </p>
          </div>
        </div>
      </div>
    `,
  }),
}
