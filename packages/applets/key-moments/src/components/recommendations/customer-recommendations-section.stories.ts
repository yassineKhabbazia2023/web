import { RecommendationPriority, RecommendationRubric } from '../../enums/key-moments.enums'
import CustomerRecommendationsSection from './customer-recommendations-section.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { PublishedRecommendationPayload } from '../../types/recommendations.types'

const RECOMMENDATIONS: PublishedRecommendationPayload[] = [
  {
    rubric: RecommendationRubric.MANAGEMENT,
    theme: 'Pilotage de l\'activité',
    priority: RecommendationPriority.PRIMARY,
    observations: 'Le suivi de l\'activité repose sur des tableurs mis à jour manuellement.',
    risk: 'Décisions prises sur des données tardives ou incomplètes.',
    recommendation: 'Mettre en place un tableau de bord mensuel partagé avec votre expert-comptable.',
    offers: [{ offerId: 10, title: 'Tableau de bord mensuel', shortDescription: 'Un pilotage consolidé.', categoryName: 'Gestion' }],
  },
  {
    rubric: RecommendationRubric.MANAGEMENT,
    theme: 'Trésorerie',
    observations: 'Aucun plan de trésorerie formalisé.',
    recommendation: 'Bâtir un plan de trésorerie glissant à 12 mois.',
    offers: [],
  },
  {
    rubric: RecommendationRubric.SOCIAL,
    theme: 'Épargne salariale',
    priority: RecommendationPriority.INFORMATIVE,
    risk: 'Une rémunération peu optimisée fiscalement.',
    recommendation: 'Étudier un accord d\'intéressement.',
    offers: [],
  },
]

const meta: Meta<typeof CustomerRecommendationsSection> = {
  title: 'Applets/KeyMoments/Recommendations/CustomerRecommendationsSection',
  component: CustomerRecommendationsSection,
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  args: {
    recommendations: RECOMMENDATIONS,
    rank: '04',
    isPreview: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** Observations and risk side by side; a lone block takes the row; both absent, no row at all. */
export const Published: Story = {}

/** Nothing visible, seen by the collaborator: the section says so. */
export const EmptyInPreview: Story = {
  args: { recommendations: [], isPreview: true },
}

/** Nothing visible, seen by the client: no section at all. */
export const EmptyForClient: Story = {
  args: { recommendations: [], isPreview: false },
}
