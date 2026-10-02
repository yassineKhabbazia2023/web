import type { Meta, StoryObj } from '@storybook/vue3-vite'
import keyMomentsClosing from '../../__mocks__/json/key-moments.12345678900015.json'
import keyMomentsIndicators from '../../__mocks__/json/key-moments.indicators.json'
import keyMomentsEngagement from '../../templates/key-moments.engagement.template.json'
import { RecommendationPriority, RecommendationRubric } from '../../enums/key-moments.enums'
import { ReportManager } from '../../managers/report.manager'
import { assembleDataset } from '../../utils/data.utils'
import { validateTemplate } from '../../validation/key-moments.validation'
import KeyMomentsReader from './key-moments-reader.vue'
import type { Closing, Indicators, Report } from '../../types/key-moments.types'

/**
 * A complete report on the default closing and engagement template. Built at
 * render time, not module load: i18n messages are only merged once the app is set up.
 */
function buildReport(): Report {
  return ReportManager.buildReport(
    assembleDataset(
      keyMomentsIndicators as unknown as Indicators,
      keyMomentsClosing as unknown as Closing,
    ),
    validateTemplate(keyMomentsEngagement),
  )
}

const meta: Meta<typeof KeyMomentsReader> = {
  title: 'Applets/KeyMoments/Pages/KeyMomentsReader',
  component: KeyMomentsReader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
  render: (args) => ({
    components: { KeyMomentsReader },
    setup() {
      const report = buildReport()

      return { args: { ...args, screens: report.screens } }
    },
    template: '<KeyMomentsReader v-bind="args" />',
  }),
  args: {
    // The dossier's own name, which the title reads rather than the one the closing carries
    entityName: 'Acme Corp',
    caption: ['Exercice du 1 janvier 2025 au 31 décembre 2025'],
    recommendations: [{
      rubric: RecommendationRubric.MANAGEMENT,
      theme: 'Pilotage de l\'activité',
      priority: RecommendationPriority.PRIMARY,
      observations: 'Le suivi repose sur des tableurs mis à jour manuellement.',
      recommendation: 'Mettre en place un tableau de bord mensuel.',
      offers: [{ offerId: 128, title: 'Pack Prévoyance TNS', shortDescription: 'Couverture des indépendants', categoryName: 'Protection sociale' }],
    }],
    isInThousands: false,
    hasReport: true,
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** One exercice: the caption names it, no selector is offered. */
export const Default: Story = {}

/** Two published exercices: the selector appears beside the unit segment. */
export const WithExerciceSelector: Story = {
  args: {
    exerciceOptions: [
      { pValue: 9, pLabel: 'Exercice 2025' },
      { pValue: 8, pLabel: 'Exercice 2024' },
    ],
    selectedExerciceId: 9,
  },
}
