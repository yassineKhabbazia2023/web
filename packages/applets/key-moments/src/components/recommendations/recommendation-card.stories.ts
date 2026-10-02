import { ref } from 'vue'
import { RecommendationPriority, RecommendationRubric as Rubric } from '../../enums/key-moments.enums'
import RecommendationCard from './recommendation-card.vue'
import RecommendationRubric from './recommendation-rubric.vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { RecommendationThemePayload } from '../../services/recommendations.service.types'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { RecommendationView } from '../../types/recommendations.types'

const CATALOG: SearchableOffer[] = [{
  id: 10,
  title: 'Tableau de bord mensuel',
  shortDescription: 'Un pilotage consolidé de l\'activité, partagé chaque mois.',
  subCategory: { subCategoryId: 1, name: 'Pilotage', category: { categoryId: 1, name: 'Gestion' } },
  searchTerms: 'tableau de bord mensuel',
}]

const THEMES: RecommendationThemePayload[] = [
  { id: 1, rubric: Rubric.MANAGEMENT, label: 'Outil de gestion' },
  { id: 2, rubric: Rubric.MANAGEMENT, label: 'Achats' },
  { id: 3, rubric: Rubric.MANAGEMENT, label: 'Trésorerie' },
]

function view(overrides: Partial<RecommendationView> = {}): RecommendationView {
  return {
    key: 'r-9',
    themeId: 1,
    themeLabel: 'Outil de gestion',
    priority: RecommendationPriority.PRIMARY,
    observations: 'Le suivi de l\'activité repose sur des tableurs mis à jour manuellement.',
    risk: 'Décisions prises sur des données tardives ou incomplètes.',
    recommendation: 'Mettre en place un tableau de bord mensuel partagé avec votre expert-comptable.',
    offerIds: [10],
    isHidden: false,
    isFromCategory: false,
    offers: [{ offerId: 10, title: 'Tableau de bord mensuel', shortDescription: 'Un pilotage consolidé.', categoryName: 'Gestion', isRetired: false }],
    isThemeRefused: false,
    ...overrides,
  }
}

const meta: Meta<typeof RecommendationCard> = {
  title: 'Applets/KeyMoments/Recommendations/RecommendationCard',
  component: RecommendationCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['!autodocs'],
  render: args => ({
    components: { RecommendationCard },
    setup() {
      const isOpen = ref(args.isOpen)

      return { args, isOpen }
    },
    template: '<RecommendationCard v-bind="args" :isOpen="isOpen" @toggle="isOpen = isOpen === false" />',
  }),
  args: {
    recommendation: view(),
    themes: THEMES,
    catalog: CATALOG,
    isOpen: true,
    hasVisibility: true,
  },
}

export default meta
type Story = StoryObj<typeof meta>

/** Copied from a category, or added by hand: the same card, the theme picked among its rubric's. */
export const Filled: Story = {}

/** Just added: no theme yet, so the line stays on the page and is written nowhere. */
export const Empty: Story = {
  args: { recommendation: view({ key: 'new-1', themeId: undefined, themeLabel: undefined, rubric: Rubric.MANAGEMENT, priority: undefined, observations: undefined, risk: undefined, recommendation: undefined, offerIds: [], offers: [] }) },
}

/** The last save was refused: the theme left the referential since it was picked. */
export const RefusedTheme: Story = {
  args: { recommendation: view({ isThemeRefused: true }) },
}

export const Masked: Story = {
  args: { recommendation: view({ isHidden: true }), isOpen: false },
}

export const WithoutPriority: Story = {
  args: { recommendation: view({ priority: undefined }) },
}

/** In a category: no client, so no visibility switch. */
export const InCategory: Story = {
  args: { hasVisibility: false },
}

export const RetiredOffer: Story = {
  args: {
    recommendation: view({
      offerIds: [10, 99],
      offers: [
        { offerId: 10, title: 'Tableau de bord mensuel', categoryName: 'Gestion', isRetired: false },
        { offerId: 99, title: '99', isRetired: true },
      ],
    }),
  },
}

const views = [view(), view({ key: 'r-10', themeId: 2, themeLabel: 'Achats', isHidden: true })]

type RubricStory = StoryObj<typeof RecommendationRubric>

function rubricStory(args: Partial<InstanceType<typeof RecommendationRubric>['$props']>): RubricStory {
  return {
    render: () => ({
      components: { RecommendationRubric },
      setup() {
        return {
          args: {
            rubric: Rubric.MANAGEMENT,
            themes: THEMES,
            views,
            openKeys: new Set<string>(),
            catalog: CATALOG,
            hasVisibility: true,
            canAdd: true,
            ...args,
          },
        }
      },
      template: '<RecommendationRubric v-bind="args" />',
    }),
  }
}

export const RubricFilled: RubricStory = rubricStory({})
export const RubricInCategory: RubricStory = rubricStory({ hasVisibility: false })
export const RubricFull: RubricStory = rubricStory({ canAdd: false })
export const RubricEmpty: RubricStory = rubricStory({ views: [] })
