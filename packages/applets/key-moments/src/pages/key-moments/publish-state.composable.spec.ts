import { ref } from 'vue'
import {
  CurrencyDisplay,
  DivergenceKind,
  PublicationState,
  RecommendationPriority,
  RecommendationRubric,
} from '../../enums/key-moments.enums'
import { usePublishState } from './publish-state.composable'
import type { PublicationDetailPayload } from '../../services/key-moments.service.types'
import type {
  ClosingSummary,
  TemplateSummary,
} from '../../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../../types/recommendations.types'
import type { ModificationRow } from './publish-state.types'

const CATALOGUE: TemplateSummary[] = [
  { templateId: 1, id: 'engagement', version: '1.0.0', label: "Comptabilité d'engagement" },
  { templateId: 2, id: 'tresorerie', version: '1.0.0', label: 'Comptabilité de trésorerie' },
]

/** Two imports of the same exercice, the most recent one first. */
const CLOSINGS: ClosingSummary[] = [
  {
    closingId: 90,
    version: 2,
    generatedAt: '2026-02-01',
    importedAt: '2026-02-02T09:00:00Z',
    importedBy: 'someone',
  },
  {
    closingId: 89,
    version: 1,
    generatedAt: '2026-01-01',
    importedAt: '2026-01-02T09:00:00Z',
    importedBy: 'someone',
  },
]

/**
 * What the client reads: the very reading the sources below describe, so that a
 * test only has to move the one thing it is about.
 */
const PUBLISHED: PublicationDetailPayload = {
  id: 7,
  exerciceId: 9,
  closingId: 90,
  closingVersion: 2,
  templateId: 1,
  templateVersion: '1.0.0',
  publishedBy: 'someone',
  publishedByName: 'Someone',
  publishedAt: '2026-02-03T09:00:00Z',
  preferenceComparisonExercice: 'N-1',
  preferenceCurrencyDisplay: CurrencyDisplay.EURO,
  isActive: true,
  comments: [{
    slotId: 'slot-1',
    text: 'the retained reading',
  }],
  hiddenWidgetIds: [],
  recommendations: [{
    rubric: RecommendationRubric.MANAGEMENT,
    theme: 'Trésorerie',
    priority: RecommendationPriority.PRIMARY,
    recommendation: 'the published recommendation',
    offers: [{ offerId: 128, title: 'Pack Prévoyance TNS' }],
  }],
}

/** The current projection, equal to what is published unless a test moves it. */
function publishedRecommendations(): PublishedRecommendationPayload[] {
  return structuredClone(PUBLISHED.recommendations)
}

/** The texts the client would read, as the microservice marks them: unchanged. */
const PUBLISHED_COMMENTS: Record<string, string> = { 'slot-1': 'the retained reading' }

function setup(overrides: {
  publicationDetail?: PublicationDetailPayload
  publication?: PublicationDetailPayload
  hasPublication?: boolean
  closingCatalogue?: ClosingSummary[]
  templateCatalogue?: TemplateSummary[]
  selectedClosingId?: number
  selectedTemplateId?: number
  selectedReferenceKey?: string
  selectedExerciceId?: number
  isInThousands?: boolean
  hasReport?: boolean
  hiddenWidgetIds?: string[]
  comments?: Record<string, string>
  publishableRecommendations?: PublishedRecommendationPayload[]
  unresolvedOfferIds?: number[]
  recommendationWithoutThemeCount?: number
  areRecommendationThemesUnreadable?: boolean
  hasRecommendationsSection?: boolean
  hasRecommendationsCategory?: boolean
  visibleRecommendationCount?: number
} = {}) {
  // `in` rather than `??` for everything a test may deliberately blank out: an
  // absent closing and an absent comparison are two of the cases under test.
  const detail = 'publicationDetail' in overrides ? overrides.publicationDetail : PUBLISHED
  const closingId = 'selectedClosingId' in overrides ? overrides.selectedClosingId : 90
  const referenceKey = 'selectedReferenceKey' in overrides
    ? overrides.selectedReferenceKey
    : 'N-1'

  const sources = {
    templateCatalogue: ref(overrides.templateCatalogue ?? CATALOGUE),
    closingCatalogue: ref(overrides.closingCatalogue ?? CLOSINGS),
    screens: ref([]),
    hiddenWidgetIds: ref(overrides.hiddenWidgetIds ?? []),
    selectedTemplateId: ref(overrides.selectedTemplateId ?? 1),
    selectedClosingId: ref<number | undefined>(closingId),
    selectedReferenceKey: ref<string | undefined>(referenceKey),
    selectedExerciceId: ref<number | undefined>(overrides.selectedExerciceId ?? 9),
    isInThousands: ref(overrides.isInThousands ?? false),
    hasReport: ref(overrides.hasReport ?? true),
    unresolvedOfferIds: ref(overrides.unresolvedOfferIds ?? []),
    recommendationWithoutThemeCount: ref(overrides.recommendationWithoutThemeCount ?? 0),
    areRecommendationThemesUnreadable: ref(overrides.areRecommendationThemesUnreadable ?? false),
    publicationDetail: ref(detail),
    publicationOf: vi.fn(() => (overrides.hasPublication === false
      ? undefined
      : overrides.publication ?? PUBLISHED)),
    buildPublishedComments: vi.fn(() => overrides.comments ?? PUBLISHED_COMMENTS),
    formatInstant: vi.fn((date: string) => `day:${date}`),
    publishableRecommendations: ref(overrides.publishableRecommendations ?? publishedRecommendations()),
    hasRecommendationsSection: ref(overrides.hasRecommendationsSection ?? true),
    hasRecommendationsCategory: ref(overrides.hasRecommendationsCategory ?? true),
    visibleRecommendationCount: ref(overrides.visibleRecommendationCount ?? 1),
  }

  return { ...usePublishState(sources), sources }
}

/** The one modification a test moved. */
function only(modifications: ModificationRow[]): ModificationRow {
  expect(modifications).toHaveLength(1)

  return modifications[0]!
}

describe('usePublishState', () => {
  describe('what publishing would settle', () => {
    it('should describe the reading on screen', () => {
      const { publishContext } = setup()

      expect(publishContext.value).toEqual({
        templateId: 1,
        templateVersion: '1.0.0',
        closingId: 90,
        closingVersion: 2,
        preferenceComparisonExercice: 'N-1',
        preferenceCurrencyDisplay: CurrencyDisplay.EURO,
      })
    })

    it('should read the unit of the page rather than a default', () => {
      const { publishContext } = setup({ isInThousands: true })

      expect(publishContext.value?.preferenceCurrencyDisplay).toBe(CurrencyDisplay.THOUSANDS)
    })

    it.each([
      { description: 'no closing is loaded', overrides: { selectedClosingId: undefined } },
      { description: 'the template is not in the catalogue', overrides: { selectedTemplateId: 999 } },
    ])('should have nothing to publish when $description', ({ overrides }) => {
      const { publishContext } = setup(overrides)

      expect(publishContext.value).toBeUndefined()
    })
  })

  /** A first exercice compares against nothing, and is published all the same. */
  it('should publish a closing that offers no comparison', () => {
    const { publishContext } = setup({ selectedReferenceKey: undefined })

    expect(publishContext.value?.preferenceComparisonExercice).toBeUndefined()
  })

  describe('what the exercice is to the client', () => {
    it('should say never published when the exercice carries no publication', () => {
      const { publicationState, modifications } = setup({ hasPublication: false })

      expect(publicationState.value).toBe(PublicationState.NEVER)
      expect(modifications.value).toEqual([])
    })

    /**
     * Not knowing what is published is never being up to date — and never
     * something to publish over: the page cannot say what would change, so
     * it says so and asks for a reload instead.
     */
    it('should say unknown when what the publication froze could not be read', () => {
      const { publicationState, publishedStateLines, isPublishDisabled } =
        setup({ publicationDetail: undefined })

      expect(publicationState.value).toBe(PublicationState.UNKNOWN)
      expect(publishedStateLines.value).toContain('keyMoments.publish.state.unreadable')
      expect(isPublishDisabled.value).toBe(true)
    })

    it('should say up to date when nothing differs', () => {
      const { publicationState, divergenceLabels, modifications } = setup()

      expect(publicationState.value).toBe(PublicationState.UP_TO_DATE)
      expect(divergenceLabels.value).toEqual([])
      expect(modifications.value).toEqual([])
    })

    /** A new import nobody chose, told apart from a choice of the firm. */
    it('should say delivery when only the version of the closing moved', () => {
      const { publicationState, divergenceLabels, modifications } = setup({
        publicationDetail: { ...PUBLISHED, closingVersion: 1 },
      })

      expect(publicationState.value).toBe(PublicationState.DELIVERY)
      expect(divergenceLabels.value).toEqual(['keyMoments.publish.divergence.closingVersion'])
      expect(modifications.value).toEqual([])
    })

    it('should say modified as soon as one gesture of the firm differs', () => {
      const { publicationState, modifications } = setup({ selectedClosingId: 89 })

      expect(publicationState.value).toBe(PublicationState.MODIFIED)
      expect(only(modifications.value).kind).toBe(DivergenceKind.CLOSING)
    })

    /**
     * The sections on screen while the figures load are not the ones that will
     * be: comparing them would announce modifications nobody made.
     */
    it('should compare nothing while the report loads', () => {
      const { divergenceLabels, modifications } = setup({
        hasReport: false,
        selectedClosingId: 89,
      })

      expect(divergenceLabels.value).toEqual([])
      expect(modifications.value).toEqual([])
    })
  })

  describe('the rows the panel displays', () => {
    it('should word a row by its kind', () => {
      const { modifications } = setup({ comments: { 'slot-1': 'reworded' } })
      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.COMMENTS)
      expect(row.label).toBe('keyMoments.publish.divergence.comments')
    })


    /** A diff names a closing the way the selector the reader picked it from does. */
    it('should name a closing through the wording of the page', () => {
      const { modifications, sources } = setup({ selectedClosingId: 89 })

      expect(only(modifications.value).values).toEqual({
        to: 'keyMoments.closingSelect.option',
      })
      expect(sources.formatInstant).toHaveBeenCalledWith('2026-01-02T09:00:00Z')
    })
  })

  describe('the recommendations', () => {

    it('should say nothing when the projection matches what is published', () => {
      const { modifications } = setup({})

      expect(modifications.value.map(row => row.kind)).not.toContain(DivergenceKind.RECOMMENDATIONS)
    })

    it('should name a reworded recommendation as a modification', () => {
      const [published] = publishedRecommendations()
      const { modifications } = setup({ publishableRecommendations: [{ ...published, recommendation: 'reworded' }] })

      const row = only(modifications.value)

      expect(row.kind).toBe(DivergenceKind.RECOMMENDATIONS)
    })

    it('should compare a publication older than the recommendations as having none', () => {
      const { modifications } = setup({
        publicationDetail: { ...PUBLISHED, recommendations: null } as unknown as PublicationDetailPayload,
        publishableRecommendations: [],
      })

      expect(modifications.value).toEqual([])
    })

    /** Hiding one leaves the projection, so it is a modification rather than a silence. */
    it('should name hiding the last visible one', () => {
      const { modifications } = setup({ publishableRecommendations: [] })

      expect(only(modifications.value).kind).toBe(DivergenceKind.RECOMMENDATIONS)
    })
  })

  describe('the recommendations line of the publish popup', () => {
    it('should say that no category was chosen', () => {
      const { publishPopupRecommendationsLine, publishPopupConfirmLabel } = setup({ hasRecommendationsCategory: false })

      expect(publishPopupRecommendationsLine.value).toBe('keyMoments.publish.popup.noCategory')
      expect(publishPopupConfirmLabel.value).toBe('keyMoments.publish.popup.confirm')
    })

    it('should count what will be published', () => {
      const { publishPopupRecommendationsLine } = setup({ visibleRecommendationCount: 3 })

      expect(publishPopupRecommendationsLine.value).toBe('keyMoments.publish.popup.recommendations')
    })

    it('should warn and ask to confirm when nothing is visible', () => {
      const { publishPopupRecommendationsLine, publishPopupConfirmLabel } = setup({ visibleRecommendationCount: 0 })

      expect(publishPopupRecommendationsLine.value).toBe('keyMoments.publish.popup.noRecommendation')
      expect(publishPopupConfirmLabel.value).toBe('keyMoments.publish.popup.confirmWithoutRecommendation')
    })
  })

  describe('what the publish gesture says', () => {
    it('should state what is published and name what publishing replaces', () => {
      const { publishedStateLines, publishPopupMessage } = setup()

      expect(publishedStateLines.value).toEqual(['keyMoments.publish.state.published'])
      expect(publishPopupMessage.value).toBe('keyMoments.publish.popup.replace')
    })

    it('should state an exercice never published, and ask plainly before the first one', () => {
      const { publishedStateLines, publishPopupMessage } = setup({ hasPublication: false })

      expect(publishedStateLines.value).toEqual(['keyMoments.publish.state.never'])
      expect(publishPopupMessage.value).toBe('keyMoments.publish.popup.message')
    })

    /**
     * The consultation line reads the figures of the publication summary:
     * absent figures state nothing — the first test of this block already
     * pins the lines down to the published one alone.
     */
    it('should state how the client has read what is published', () => {
      const { publishedStateLines, sources } = setup({
        publication: { ...PUBLISHED, viewCount: 3, lastViewedAt: '2026-02-04T09:00:00Z' },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.viewed')
      expect(sources.formatInstant).toHaveBeenCalledWith('2026-02-04T09:00:00Z')
    })

    it('should state in words a publication the client never opened', () => {
      const { publishedStateLines } = setup({
        publication: { ...PUBLISHED, viewCount: 0, lastViewedAt: null },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.neverViewed')
    })

    /** A count beside no date would format an empty date: said as never read instead. */
    it('should never format an absent date, whatever the count says', () => {
      const { publishedStateLines, sources } = setup({
        publication: { ...PUBLISHED, viewCount: 2, lastViewedAt: null },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.neverViewed')
      expect(sources.formatInstant).not.toHaveBeenCalledWith(null)
    })

    it('should state a delivery the client has not received', () => {
      const { publishedStateLines } = setup({
        publicationDetail: { ...PUBLISHED, closingVersion: 1 },
      })

      expect(publishedStateLines.value).toContain('keyMoments.publish.state.delivery')
    })

    it('should offer publishing only once something would change', () => {
      const upToDate = setup()
      const modified = setup({ isInThousands: true })

      expect(upToDate.isPublishDisabled.value).toBe(true)
      expect(modified.isPublishDisabled.value).toBe(false)
    })

    it('should never offer publishing while the report loads', () => {
      const { isPublishDisabled } = setup({ isInThousands: true, hasReport: false })

      expect(isPublishDisabled.value).toBe(true)
    })

    it('should refuse to publish a retired recommendation, and say why', () => {
      const { isPublishDisabled, publishBlockedReason } = setup({
        isInThousands: true,
        unresolvedOfferIds: [128],
      })

      expect(isPublishDisabled.value).toBe(true)
      expect(publishBlockedReason.value).toBe('keyMoments.publish.state.unresolvedOffers')
    })

    /**
     * Without the themes the projection is empty while the saved list is not:
     * the preview and the diff would show none of what would be published.
     */
    it('should refuse to publish while the themes are unreadable, and announce no phantom modification', () => {
      const { isPublishDisabled, publishBlockedReason, modifications } = setup({
        areRecommendationThemesUnreadable: true,
        publishableRecommendations: [],
        recommendationWithoutThemeCount: 2,
      })

      expect(isPublishDisabled.value).toBe(true)
      expect(publishBlockedReason.value).toBe('keyMoments.publish.state.themesUnreadable')
      expect(modifications.value).toEqual([])
    })

    it('should refuse to publish a recommendation without a theme, and say why first', () => {
      const { isPublishDisabled, publishBlockedReason } = setup({
        isInThousands: true,
        unresolvedOfferIds: [128],
        recommendationWithoutThemeCount: 2,
      })

      expect(isPublishDisabled.value).toBe(true)
      expect(publishBlockedReason.value).toBe('keyMoments.publish.state.recommendationsWithoutTheme')
    })

    it('should refuse to publish without access to the offers, and say why first', () => {
      const { isPublishDisabled, publishBlockedReason } = setup({
        isInThousands: true,
        hasRecommendationsSection: false,
        recommendationWithoutThemeCount: 2,
      })

      expect(isPublishDisabled.value).toBe(true)
      expect(publishBlockedReason.value).toBe('keyMoments.publish.state.offersAccessRequired')
    })

    it('should have no reason to give while nothing blocks', () => {
      const { publishBlockedReason } = setup()

      expect(publishBlockedReason.value).toBeUndefined()
    })

    it.each([
      {
        description: 'modifications',
        overrides: { isInThousands: true },
        label: 'keyMoments.publish.button.modifications',
      },
      {
        description: 'an unreceived delivery',
        overrides: { publicationDetail: { ...PUBLISHED, closingVersion: 1 } },
        label: 'keyMoments.publish.button.update',
      },
      {
        description: 'a first publication',
        overrides: { hasPublication: false },
        label: 'keyMoments.publish.button.default',
      },
    ])('should word the button for $description', ({ overrides, label }) => {
      const { publishButtonLabel } = setup(overrides)

      expect(publishButtonLabel.value).toBe(label)
    })
  })
})
