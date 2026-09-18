import { logger } from '@pulse/toolbox'
import {
  assembleDataset,
  checkTemplateAgainstData,
  selectKnownMeasures,
  selectKnownValues,
} from './data.utils'
import {
  IndicatorSign,
  MeasureNature,
  Renderer,
  ValueKind,
} from '../enums/key-moments.enums'
import type {
  Closing,
  Indicators,
  Measure,
  Template,
} from '../types/key-moments.types'

const MEASURES: Measure[] = [
  { key: 'N', nature: MeasureNature.PERIOD, closingDate: '2025-12-31' },
  { key: 'N-1', nature: MeasureNature.PERIOD, closingDate: '2024-12-31' },
  { key: 'variation.N-1', nature: MeasureNature.VARIATION, from: 'N-1', to: 'N' },
  {
    key: 'variationPct.N-1',
    nature: MeasureNature.VARIATION,
    from: 'N-1',
    to: 'N',
    kind: ValueKind.PERCENTAGE,
  },
]

const INDICATOR_IDS = ['chiffre-affaires', 'achats-consommes', 'total-general']

function buildIndicators(overrides: Partial<Indicators> = {}): Indicators {
  return {
    version: '5.0.0',
    indicators: [
      {
        id: 'chiffre-affaires',
        label: 'Chiffre d\'affaires',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.INCOME,
      },
      {
        id: 'achats-consommes',
        label: 'Achats consommés',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.EXPENSE,
      },
      {
        id: 'total-general',
        label: 'Total général',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.INCOME,
        components: [
          { indicator: 'chiffre-affaires' },
          { indicator: 'achats-consommes' },
        ],
      },
    ],
    ...overrides,
  }
}

function buildTemplate(indicatorIds = INDICATOR_IDS): Template {
  return {
    version: '6.0.0',
    id: 'engagement',
    label: "Comptabilité d'engagement",
    defaultMeasures: [],
    screens: [{
      id: 'activite',
      title: 'Votre activité',
      widgets: [{
        id: 'synthese',
        display: { title: 'Synthèse de l\'activité', renderer: Renderer.TABLE },
        lines: indicatorIds.map(indicator => ({ indicator })),
      }],
    }],
  }
}

function buildClosing(overrides: Partial<Closing> = {}): Closing {
  return {
    metadata: {
      schemaVersion: '5.0.0',
      generatedAt: '2026-07-26T09:00:00+02:00',
      generator: 'MomentCle-Export/1.0',
      entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
      currency: 'EUR',
      locale: 'fr-FR',
      exercice: { startDate: '2025-01-01', endDate: '2025-12-31' },
      measures: MEASURES,
    },
    values: {
      'chiffre-affaires': { 'N': 2000, 'N-1': 1000, 'variation.N-1': 1000, 'variationPct.N-1': 100 },
      'achats-consommes': { N: 500 },
      'total-general': { N: 2500 },
    },
    comments: { synthese: 'Un commentaire' },
    ...overrides,
  }
}

describe('selectKnownValues', () => {

  it('should keep the figures of a declared indicator, keyed by indicator then by measure', () => {
    const values = selectKnownValues(
      { 'chiffre-affaires': { 'N': 2000, 'N-1': 1000 } },
      INDICATOR_IDS,
    )

    expect(values).toEqual({ 'chiffre-affaires': { 'N': 2000, 'N-1': 1000 } })
  })

  it('should drop the figures of an unknown indicator without a word', () => {
    const values = selectKnownValues(
      { 'chiffre-affaires': { N: 2000 }, inconnu: { N: 42 } },
      INDICATOR_IDS,
    )

    expect(values).toEqual({ 'chiffre-affaires': { N: 2000 } })
    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })

  it('should return nothing when the closing carries no figure', () => {
    expect(selectKnownValues({}, INDICATOR_IDS)).toEqual({})
  })
})

describe('selectKnownMeasures', () => {

  it('should keep the figures naming a declared measure', () => {
    const values = selectKnownMeasures({ 'chiffre-affaires': { 'N': 2000, 'N-1': 1000 } }, MEASURES)

    expect(values).toEqual({ 'chiffre-affaires': { 'N': 2000, 'N-1': 1000 } })
  })

  it('should drop a figure naming a measure the dictionary does not declare, without a word', () => {
    const values = selectKnownMeasures(
      { 'chiffre-affaires': { N: 2000, variationPts: 3 } },
      MEASURES,
    )

    expect(values).toEqual({ 'chiffre-affaires': { N: 2000 } })
    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })
})

describe('assembleDataset', () => {

  it('should merge the vocabulary and the closing into a single dataset', () => {
    const data = assembleDataset(buildIndicators(), buildClosing())

    expect(data.metadata.entity.siret).toBe('12345678900015')
    expect(data.indicators).toHaveLength(3)
    expect(data.values['chiffre-affaires'])
      .toEqual({ 'N': 2000, 'N-1': 1000, 'variation.N-1': 1000, 'variationPct.N-1': 100 })
    expect(data.comments.synthese).toBe('Un commentaire')
  })

  /**
   * The figures are produced upstream and this page cannot correct them: what
   * diverges is for whoever produces the closing. Reading a dossier never
   * reproaches its figures.
   */
  it('should stay silent on figures that contradict each other', () => {
    const closing = buildClosing({
      values: {
        'chiffre-affaires': { 'N': 2000, 'N-1': 1000, 'variation.N-1': 400 },
        'achats-consommes': { N: 500 },
        'total-general': { N: 1200 },
      },
    })

    assembleDataset(buildIndicators(), closing)

    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })

  it('should leave the values untouched when an aggregate does not match', () => {
    const closing = buildClosing({
      values: {
        'chiffre-affaires': { N: 2000 },
        'achats-consommes': { N: 500 },
        'total-general': { N: 1200 },
      },
    })
    const data = assembleDataset(buildIndicators(), closing)

    expect(data.values['total-general']).toEqual({ N: 1200 })
  })
})

describe('checkTemplateAgainstData', () => {

  it('should report a template line naming a indicator absent from the vocabulary', () => {
    const data = assembleDataset(buildIndicators(), buildClosing())

    checkTemplateAgainstData(buildTemplate(['inconnu']), data)

    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      '[KeyMoments] template lines naming indicators absent from the vocabulary',
      ['inconnu'],
    )
  })

  it('should report every unknown indicator of the template in a single call', () => {
    const data = assembleDataset(buildIndicators(), buildClosing())

    vi.mocked(logger.warn).mockClear()
    checkTemplateAgainstData(buildTemplate(['inconnu', 'autre-inconnu', 'inconnu']), data)

    expect(vi.mocked(logger.warn)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      '[KeyMoments] template lines naming indicators absent from the vocabulary',
      ['inconnu', 'autre-inconnu'],
    )
  })

  it('should stay silent when every line names a declared indicator', () => {
    const data = assembleDataset(buildIndicators(), buildClosing())

    vi.mocked(logger.warn).mockClear()
    checkTemplateAgainstData(buildTemplate(), data)

    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })
})
