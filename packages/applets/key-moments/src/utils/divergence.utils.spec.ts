import { divergencesBetween } from './divergence.utils'
import {
  CurrencyDisplay,
  DivergenceFamily,
  DivergenceKind,
  RecommendationPriority,
  RecommendationRubric,
} from '../enums/key-moments.enums'
import type { PublishableState } from '../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../types/recommendations.types'

/** What the client reads today, and what the page would publish if unchanged. */
const PUBLISHED: PublishableState = {
  templateId: 1,
  templateName: 'Générique',
  templateCode: 'generique',
  templateVersion: '1.0.0',
  closingId: 42,
  closingName: 'Version 3 (13/08/2026)',
  closingVersion: 3,
  preferenceComparisonExercice: 'N-1',
  preferenceCurrencyDisplay: CurrencyDisplay.EURO,
  comments: { synthese: 'Trésorerie stabilisée.', bilan: 'Structure saine.' },
  hiddenWidgets: ['effectifs'],
  recommendations: [
    { rubric: RecommendationRubric.MANAGEMENT, theme: 'Trésorerie', priority: RecommendationPriority.PRIMARY, recommendation: 'Un tableau de bord.', offers: [{ offerId: 128, title: 'Pilotage' }] },
    { rubric: RecommendationRubric.MANAGEMENT, theme: 'Achats', recommendation: 'Renégocier.', offers: [] },
  ],
}

function withRecommendations(...recommendations: PublishedRecommendationPayload[]): PublishableState {
  return withChange({ recommendations })
}

function withChange(change: Partial<PublishableState>): PublishableState {
  return { ...PUBLISHED, ...change }
}

describe('key-moments publication divergences', () => {

  it('should report nothing when publishing would change nothing', () => {
    expect(divergencesBetween(withChange({}), PUBLISHED)).toEqual([])
  })

  describe('the closing', () => {

    /** Which one would be published is the thing the reader has to be told. */
    it('should read another closing as a decision of the firm, and name it', () => {
      const [divergence] = divergencesBetween(
        withChange({ closingId: 43, closingName: 'Version 1 (02/08/2026)' }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.CLOSING)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ to: 'Version 1 (02/08/2026)' })
    })

    it('should read a new version of the same closing as a delivery', () => {
      const [divergence] = divergencesBetween(withChange({ closingVersion: 4 }), PUBLISHED)

      expect(divergence.kind).toBe(DivergenceKind.CLOSING_VERSION)
      expect(divergence.family).toBe(DivergenceFamily.DELIVERY)
      expect(divergence.values).toEqual({ from: 3, to: 4 })
    })

    /** Naming the version of a document that was itself replaced says nothing. */
    it('should not name a version when the closing itself changed', () => {
      const divergences = divergencesBetween(
        withChange({ closingId: 43, closingVersion: 1 }),
        PUBLISHED,
      )

      expect(divergences).toHaveLength(1)
      expect(divergences[0].kind).toBe(DivergenceKind.CLOSING)
    })
  })

  describe('the template', () => {

    it('should name both templates when the layout changed', () => {
      const [divergence] = divergencesBetween(
        withChange({ templateId: 2, templateName: 'Pharmacie', templateCode: 'pharmacie' }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.TEMPLATE)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ from: 'Générique', to: 'Pharmacie' })
    })

    /** Two versions of one model are two catalogue entries: still a delivery. */
    it('should read another entry of the same model as a delivery', () => {
      const [divergence] = divergencesBetween(withChange({ templateId: 3, templateVersion: '1.1.0' }), PUBLISHED)

      expect(divergence.kind).toBe(DivergenceKind.TEMPLATE_VERSION)
      expect(divergence.family).toBe(DivergenceFamily.DELIVERY)
    })

    it('should read a new version of the same template as a delivery', () => {
      const [divergence] = divergencesBetween(withChange({ templateVersion: '1.1.0' }), PUBLISHED)

      expect(divergence.kind).toBe(DivergenceKind.TEMPLATE_VERSION)
      expect(divergence.family).toBe(DivergenceFamily.DELIVERY)
      expect(divergence.values).toEqual({ from: '1.0.0', to: '1.1.0' })
    })
  })

  describe('the reading preferences', () => {

    it('should name the comparison it moves from and to', () => {
      const [divergence] = divergencesBetween(
        withChange({ preferenceComparisonExercice: 'N-2' }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.COMPARISON)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ from: 'N-1', to: 'N-2' })
    })

    it('should name the unit it moves to', () => {
      const [divergence] = divergencesBetween(
        withChange({ preferenceCurrencyDisplay: CurrencyDisplay.THOUSANDS }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.CURRENCY)
      expect(divergence.values).toEqual({ to: CurrencyDisplay.THOUSANDS })
    })
  })

  describe('the retained texts', () => {

    it('should count a reworded slot', () => {
      const [divergence] = divergencesBetween(
        withChange({ comments: { ...PUBLISHED.comments, synthese: 'Trésorerie tendue.' } }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.COMMENTS)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should count a slot that gained a text and one that lost it', () => {
      const [divergence] = divergencesBetween(
        withChange({
          comments: { synthese: PUBLISHED.comments.synthese, bilan: '', tresorerie: 'Neuf.' },
        }),
        PUBLISHED,
      )

      expect(divergence.values).toEqual({ count: 2 })
    })

    /**
     * The publication is frozen by the microservice, which keeps the readings of
     * the exercise and not of a template. A text it froze for a slot the report
     * no longer carries is read by nobody — counting it named a modification
     * that no gesture made, and that the undo button could never reach.
     */
    it('should ignore a published text the report on screen does not carry', () => {
      expect(divergencesBetween(
        withChange({ comments: { synthese: PUBLISHED.comments.synthese } }),
        withChange({ comments: { ...PUBLISHED.comments, orphelin: 'Slot hors gabarit.' } }),
      )).toEqual([])
    })

    /** Nothing goes out either way: the two sides must not part over the shape. */
    it('should read a slot published empty and one publishing nothing as one', () => {
      expect(divergencesBetween(
        withChange({ comments: { ...PUBLISHED.comments, tresorerie: '' } }),
        withChange({ comments: { ...PUBLISHED.comments, tresorerie: '' } }),
      )).toEqual([])

      expect(divergencesBetween(
        withChange({ comments: { ...PUBLISHED.comments, tresorerie: '' } }),
        PUBLISHED,
      )).toEqual([])
    })

    /** The client reads a text, never the voice the firm retained it from. */
    it('should ignore a text retained from another voice under the same words', () => {
      expect(divergencesBetween(withChange({ comments: { ...PUBLISHED.comments } }), PUBLISHED))
        .toEqual([])
    })
  })

  describe('the sub-sections left out', () => {

    it('should tell hiding one apart from bringing one back', () => {
      const [divergence] = divergencesBetween(
        withChange({ hiddenWidgets: ['dettes'] }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.HIDDEN_WIDGETS)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ hidden: 1, shown: 1 })
    })

    it('should ignore the order they are held in', () => {
      const published = withChange({ hiddenWidgets: ['effectifs', 'dettes'] })
      const current = withChange({ hiddenWidgets: ['dettes', 'effectifs'] })

      expect(divergencesBetween(current, published)).toEqual([])
    })
  })

  /** Publishing carries everything at once, so the popup must name everything. */
  it('should report both families together', () => {
    const divergences = divergencesBetween(
      withChange({ closingVersion: 4, preferenceCurrencyDisplay: CurrencyDisplay.THOUSANDS }),
      PUBLISHED,
    )

    expect(divergences.map(divergence => divergence.family)).toEqual([
      DivergenceFamily.DELIVERY,
      DivergenceFamily.MODIFICATION,
    ])
  })

  /**
   * Both sides are the published projection — visible recommendations only —
   * which is what makes hiding one report here instead of passing as silence.
   */
  describe('the recommendations', () => {
    const [first, second] = PUBLISHED.recommendations

    it('should report nothing when the same recommendations are decided the same way', () => {
      expect(divergencesBetween(withRecommendations(first, second), PUBLISHED)).toEqual([])
    })

    it('should report adding one, as a decision of the firm', () => {
      const [divergence] = divergencesBetween(
        withRecommendations(first, second, { rubric: RecommendationRubric.SOCIAL, theme: 'Paie', recommendation: 'Externaliser.', offers: [] }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.RECOMMENDATIONS)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should report hiding one, which leaves the projection', () => {
      const [divergence] = divergencesBetween(withRecommendations(first), PUBLISHED)

      expect(divergence.kind).toBe(DivergenceKind.RECOMMENDATIONS)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should report a reworded text, a changed priority and a changed offer list', () => {
      expect(divergencesBetween(withRecommendations({ ...first, recommendation: 'Autre.' }, second), PUBLISHED)[0].kind)
        .toBe(DivergenceKind.RECOMMENDATIONS)
      expect(divergencesBetween(withRecommendations({ ...first, priority: undefined }, second), PUBLISHED)[0].kind)
        .toBe(DivergenceKind.RECOMMENDATIONS)
      expect(divergencesBetween(withRecommendations({ ...first, offers: [] }, second), PUBLISHED)[0].kind)
        .toBe(DivergenceKind.RECOMMENDATIONS)
    })

    /** The order is the reading order, so swapping two is a modification: one line moved. */
    it('should report a swap as the one line that moved', () => {
      const [divergence] = divergencesBetween(withRecommendations(second, first), PUBLISHED)

      expect(divergence.values).toEqual({ count: 1 })
    })

    /** An absent text and an empty one say the same thing to the reader. */
    it('should not report a text emptied on one side and absent on the other', () => {
      expect(divergencesBetween(withRecommendations(first, { ...second, observations: '' }), PUBLISHED)).toEqual([])
    })

    it('should report nothing at all when neither side carries a recommendation', () => {
      expect(divergencesBetween(withChange({ recommendations: [] }), { ...PUBLISHED, recommendations: [] })).toEqual([])
    })
  })
})
