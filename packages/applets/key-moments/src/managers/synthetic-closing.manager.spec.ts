import keyMomentsEngagement from '../templates/key-moments.engagement.template.json'
import { validateTemplate } from '../validation/key-moments.validation'
import { IndicatorSign, MeasureNature, ValueKind } from '../enums/key-moments.enums'
import { SyntheticClosingManager } from './synthetic-closing.manager'

const VOCABULARY = [
  { id: 'ca', label: 'CA', kind: ValueKind.AMOUNT, sign: IndicatorSign.INCOME },
  { id: 'taux', label: 'Taux', kind: ValueKind.PERCENTAGE, sign: IndicatorSign.INCOME },
  { id: 'delai', label: 'Délai', kind: ValueKind.DAYS, sign: IndicatorSign.EXPENSE },
  { id: 'etp', label: 'ETP', kind: ValueKind.HEADCOUNT, sign: IndicatorSign.INCOME },
]
const TEMPLATE = validateTemplate(keyMomentsEngagement)

describe('SyntheticClosingManager', () => {
  const dataset = SyntheticClosingManager.buildDataset(VOCABULARY, TEMPLATE, '[commentaire]')

  it('should declare the reference dictionary, most recent period first', () => {
    const keys = dataset.metadata.measures.map(measure => measure.key)

    expect(keys).toEqual([
      'N',
      'N-1',
      'N-2',
      'variation.N-1',
      'variationPct.N-1',
      'variation.N-2',
      'variationPct.N-2',
      'poidsCaPct.N',
    ])
    expect(dataset.metadata.measures[0]).toMatchObject({ nature: MeasureNature.PERIOD })
  })

  it('should draw every figure of the range, whatever the indicator and the measure', () => {
    const figures = Object.values(dataset.values).flatMap(measures => Object.values(measures))

    expect(figures).toHaveLength(VOCABULARY.length * dataset.metadata.measures.length)
    figures.forEach((figure) => {
      expect(Number.isInteger(figure)).toBe(true)
      expect(figure).toBeGreaterThanOrEqual(50)
      expect(figure).toBeLessThanOrEqual(150)
    })
  })

  it('should give figures varied enough to read a layout on', () => {
    expect(new Set(Object.values(dataset.values.ca)).size).toBeGreaterThan(1)
    expect(dataset.values.ca.N).not.toBe(dataset.values.taux.N)
  })

  it('should give the same figures on every build, so that an edit moves nothing', () => {
    const rebuilt = SyntheticClosingManager.buildDataset(VOCABULARY, TEMPLATE, '[commentaire]')

    expect(rebuilt.values).toEqual(dataset.values)
  })

  it('should carry the vocabulary as given', () => {
    expect(dataset.indicators).toBe(VOCABULARY)
  })

  it('should fill every comment slot the template cites with the placeholder', () => {
    expect(dataset.comments.tba).toBe('[commentaire]')
    expect(Object.keys(dataset.comments)).toHaveLength(24)
  })
})
