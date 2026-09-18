import { divergencesBetween } from './divergence.utils'
import { publishableOffers } from './offers.utils'
import {
  CurrencyDisplay,
  DivergenceFamily,
  DivergenceKind,
  OfferPriority,
} from '../enums/key-moments.enums'
import type { PublishableState } from '../types/key-moments.types'

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
  offers: [
    { offerId: 128, comment: 'Adapté à votre passage en SASU', priority: OfferPriority.PRIMARY, isPriorityVisible: true },
    { offerId: 300, isPriorityVisible: false },
  ],
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
   * Both sides are projections that already leave the hidden offers out, which
   * is what makes hiding one report here instead of passing for a detachment.
   */
  describe('the recommendations', () => {

    it('should report nothing when the same offers are decided the same way', () => {
      expect(divergencesBetween(withChange({ offers: [...PUBLISHED.offers] }), PUBLISHED))
        .toEqual([])
    })

    it('should report attaching one, as a decision of the firm', () => {
      const [divergence] = divergencesBetween(
        withChange({ offers: [...PUBLISHED.offers, { offerId: 512, isPriorityVisible: false }] }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
      expect(divergence.family).toBe(DivergenceFamily.MODIFICATION)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should report detaching one', () => {
      const [divergence] = divergencesBetween(
        withChange({ offers: [PUBLISHED.offers[0]] }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
      expect(divergence.values).toEqual({ count: 1 })
    })

    /**
     * The chain that makes hiding report: the stored list keeps the offer,
     * `publishableOffers` drops it, and the comparison then differs from what
     * is published. Written through the projection rather than around it —
     * comparing the stored list itself would read a hidden offer as a detached
     * one, which is the mistake this test exists to catch.
     */
    it('should report hiding one, through the publishable projection', () => {
      const stored = [
        {
          offerId: 128,
          title: 'Pack Prévoyance TNS',
          comment: 'Adapté à votre passage en SASU',
          priority: OfferPriority.PRIMARY,
          isPriorityVisible: true,
          isHidden: false,
        },
        { offerId: 300, title: 'Épargne salariale', isPriorityVisible: false, isHidden: true },
      ]

      const [divergence] = divergencesBetween(
        withChange({ offers: publishableOffers(stored) }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should report a reworded comment', () => {
      const [divergence] = divergencesBetween(
        withChange({
          offers: [{ ...PUBLISHED.offers[0], comment: 'Une autre accroche' }, PUBLISHED.offers[1]],
        }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should report a reworded benefits note', () => {
      const [divergence] = divergencesBetween(
        withChange({
          offers: [{ ...PUBLISHED.offers[0], benefitsComment: 'Un autre bénéfice' }, PUBLISHED.offers[1]],
        }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
      expect(divergence.values).toEqual({ count: 1 })
    })

    it('should report a degree that changed', () => {
      const [divergence] = divergencesBetween(
        withChange({
          offers: [
            { ...PUBLISHED.offers[0], priority: OfferPriority.INFORMATIVE },
            PUBLISHED.offers[1],
          ],
        }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
    })

    /** Telling a degree that used to be shown changes what the client reads. */
    it('should report a degree that stopped being shown', () => {
      const [divergence] = divergencesBetween(
        withChange({
          offers: [{ ...PUBLISHED.offers[0], isPriorityVisible: false }, PUBLISHED.offers[1]],
        }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
    })

    /** The order is the reading order, so swapping two is a modification. */
    it('should report a swap, counting both positions that moved', () => {
      const [divergence] = divergencesBetween(
        withChange({ offers: [PUBLISHED.offers[1], PUBLISHED.offers[0]] }),
        PUBLISHED,
      )

      expect(divergence.kind).toBe(DivergenceKind.OFFERS)
      expect(divergence.values).toEqual({ count: 2 })
    })

    /** An absent text and an empty one say the same thing to the reader. */
    it('should not report a comment emptied on one side and absent on the other', () => {
      expect(divergencesBetween(
        withChange({ offers: [PUBLISHED.offers[0], { ...PUBLISHED.offers[1], comment: '' }] }),
        PUBLISHED,
      )).toEqual([])
    })

    it('should report nothing at all when neither side carries a recommendation', () => {
      expect(divergencesBetween(
        withChange({ offers: [] }),
        { ...PUBLISHED, offers: [] },
      )).toEqual([])
    })
  })
})
