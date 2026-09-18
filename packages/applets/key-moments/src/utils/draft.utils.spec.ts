import { buildDraftReport, customerOffersOf, projectDraftDataset } from './draft.utils'
import { assembleDataset } from './data.utils'
import {
  IndicatorSign,
  MeasureNature,
  OfferPriority,
  PublicationState,
  Renderer,
  ValueKind,
} from '../enums/key-moments.enums'
import type { KeyMomentsDraft, KeyMomentsDraftPublishing } from '../stores/key-moments-draft.types'
import type {
  Closing,
  Indicators,
  LinkedOffer,
  Template,
} from '../types/key-moments.types'

const INDICATORS: Indicators = {
  indicators: [{
    id: 'chiffre-d-affaires',
    label: "Chiffre d'affaires",
    kind: ValueKind.AMOUNT,
    sign: IndicatorSign.INCOME,
  }],
}

const CLOSING: Closing = {
  metadata: {
    schemaVersion: '5.0.0',
    generatedAt: '2026-01-15T10:00:00Z',
    generator: 'test',
    entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
    currency: 'EUR',
    locale: 'fr-FR',
    exercice: { startDate: '2025-01-01', endDate: '2025-12-31' },
    measures: [
      { key: 'N', nature: MeasureNature.PERIOD, closingDate: '2025-12-31' },
      { key: 'N-1', nature: MeasureNature.PERIOD, closingDate: '2024-12-31' },
      { key: 'variation.N-1', nature: MeasureNature.VARIATION, from: 'N-1', to: 'N' },
    ],
  },
  values: {
    'chiffre-d-affaires': { 'N': 1000000, 'N-1': 900000, 'variation.N-1': 100000 },
  },
  comments: { synthese: 'Le texte brut de la livraison.', detail: 'Le détail livré.' },
}

/**
 * Three sections: one read whole, one whose only widget the firm hid — which
 * empties it — and one hidden as a whole by the template.
 */
const TEMPLATE = {
  version: '6.0.0',
  id: 'engagement',
  label: "Comptabilité d'engagement",
  defaultMeasures: [{ measure: 'N' }, { measure: 'N-1' }],
  screens: [
    {
      id: 'activite',
      title: 'Votre activité',
      widgets: [
        {
          id: 'synthese',
          lines: [{ indicator: 'chiffre-d-affaires' }],
          comment: 'synthese',
          display: { title: 'Synthèse', renderer: Renderer.TABLE, span: 12 },
        },
        {
          id: 'detail',
          lines: [{ indicator: 'chiffre-d-affaires' }],
          comment: 'detail',
          hidden: { widget: true },
          display: { title: 'Détail', renderer: Renderer.TABLE, span: 12 },
        },
      ],
    },
    {
      id: 'videe',
      title: 'Section vidée',
      widgets: [{
        id: 'videe-detail',
        lines: [{ indicator: 'chiffre-d-affaires' }],
        hidden: { widget: true },
        display: { title: 'Détail', renderer: Renderer.TABLE, span: 12 },
      }],
    },
    {
      id: 'coulisses',
      title: 'Section masquée',
      hidden: true,
      widgets: [{
        id: 'coulisses-detail',
        lines: [{ indicator: 'chiffre-d-affaires' }],
        display: { title: 'Détail', renderer: Renderer.TABLE, span: 12 },
      }],
    },
  ],
} as unknown as Template

const PUBLISHING: KeyMomentsDraftPublishing = {
  context: {} as KeyMomentsDraftPublishing['context'],
  snapshots: [],
  buttonLabel: 'Publier',
  popupMessage: '',
  divergenceLabels: [],
  isDisabled: false,
}

function draftOf(comments: Record<string, string>): KeyMomentsDraft {
  return {
    exerciceId: 9,
    exerciceStartDate: '2025-01-01',
    exerciceEndDate: '2025-12-31',
    locale: 'fr-FR',
    dataset: projectDraftDataset(assembleDataset(INDICATORS, structuredClone(CLOSING)), comments),
    template: structuredClone(TEMPLATE),
    referenceKey: 'N-1',
    isInThousands: false,
    offers: [],
    publicationState: PublicationState.NEVER,
    publishing: PUBLISHING,
  }
}

function linkedOffer(overrides: Partial<LinkedOffer> = {}): LinkedOffer {
  return {
    offerId: 128,
    title: 'Pack Prévoyance TNS',
    shortDescription: 'Couverture des indépendants',
    categoryName: 'Protection sociale',
    comment: 'Adapté à votre passage en SASU',
    benefitsComment: 'Une couverture sans reste à charge',
    priority: OfferPriority.PRIMARY,
    isPriorityVisible: true,
    isHidden: false,
    isRetired: false,
    ...overrides,
  }
}

describe('draft.utils', () => {
  describe('buildDraftReport', () => {
    it('should drop the sub-sections the firm hid', () => {
      const report = buildDraftReport(draftOf({}), false)

      expect(report.screens[0].widgets.map(widget => widget.id)).toEqual(['synthese'])
    })

    it('should drop the sections left empty and the ones the template hides', () => {
      const report = buildDraftReport(draftOf({}), false)

      expect(report.screens.map(screen => screen.id)).toEqual(['activite'])
    })

    it('should read the texts that would be published rather than those of the closing', () => {
      const report = buildDraftReport(draftOf({ synthese: 'Le texte que le cabinet publie.' }), false)

      expect(report.screens[0].widgets[0].comment).toBe('Le texte que le cabinet publie.')
    })

    it('should read nothing for a slot that would not go out', () => {
      const report = buildDraftReport(draftOf({ synthese: '' }), false)

      expect(report.screens[0].widgets[0].comment).toBe('')
    })

    it('should lay the figures out in the unit asked for', () => {
      const report = buildDraftReport(draftOf({}), true)

      expect(report.entity.name).toBe('SAS TEST')
      expect(report.screens).toHaveLength(1)
    })
  })

  describe('customerOffersOf', () => {
    it('should serve the attached offers in order, reduced to what the client reads', () => {
      const offers = customerOffersOf([
        linkedOffer({ offerId: 2, title: 'Deux' }),
        linkedOffer({ offerId: 1, title: 'Un' }),
      ])

      expect(offers.map(offer => offer.offerId)).toEqual([2, 1])
      expect(offers[0]).toEqual({
        offerId: 2,
        title: 'Deux',
        shortDescription: 'Couverture des indépendants',
        categoryName: 'Protection sociale',
        comment: 'Adapté à votre passage en SASU',
        benefitsComment: 'Une couverture sans reste à charge',
        priority: OfferPriority.PRIMARY,
      })
    })

    it('should leave out the hidden and the retired ones', () => {
      const offers = customerOffersOf([
        linkedOffer({ offerId: 1, isHidden: true }),
        linkedOffer({ offerId: 2, isRetired: true }),
        linkedOffer({ offerId: 3 }),
      ])

      expect(offers.map(offer => offer.offerId)).toEqual([3])
    })

    it('should omit the degree the firm chose not to show', () => {
      const [offer] = customerOffersOf([linkedOffer({ isPriorityVisible: false })])

      expect(offer.priority).toBeUndefined()
    })
  })
})
