import { MeasureNature, ValueKind } from '../enums/key-moments.enums'
import type { Dataset, Indicator, Measure, Template } from '../types/key-moments.types'

const LOWEST_VALUE = 50
const HIGHEST_VALUE = 150

/** The reference measure dictionary, closing on the current year. */
function referenceMeasures(year: number): Measure[] {
  const closing = (offset: number): string => `${year - offset}-12-31`

  return [
    { key: 'N', nature: MeasureNature.PERIOD, closingDate: closing(0) },
    { key: 'N-1', nature: MeasureNature.PERIOD, closingDate: closing(1) },
    { key: 'N-2', nature: MeasureNature.PERIOD, closingDate: closing(2) },
    { key: 'variation.N-1', nature: MeasureNature.VARIATION, from: 'N-1', to: 'N' },
    { key: 'variationPct.N-1', nature: MeasureNature.VARIATION, from: 'N-1', to: 'N', kind: ValueKind.PERCENTAGE },
    { key: 'variation.N-2', nature: MeasureNature.VARIATION, from: 'N-2', to: 'N' },
    { key: 'variationPct.N-2', nature: MeasureNature.VARIATION, from: 'N-2', to: 'N', kind: ValueKind.PERCENTAGE },
    { key: 'poidsCaPct.N', nature: MeasureNature.RATIO, of: 'chiffre-d-affaires', period: 'N', kind: ValueKind.PERCENTAGE },
  ]
}

/**
 * A figure of the range, drawn from what names the cell rather than from
 * chance: the dataset is rebuilt on every edit, and figures jumping at each
 * keystroke would have an author reading the numbers instead of the layout.
 */
function valueFor(indicator: Indicator, measure: Measure): number {
  const named = `${indicator.id}/${measure.key}`
  const hash = [...named].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 0xffffffff, 0)

  return LOWEST_VALUE + (hash % (HIGHEST_VALUE - LOWEST_VALUE + 1))
}

/**
 * A closing with nothing to say: every figure is drawn from the range, so that
 * the editor shows the layout of a template rather than a dossier. Built
 * directly rather than through `assembleDataset`, whose checks (aggregates
 * against their components, derived measures) would only ever report what is
 * synthetic by design.
 */
export class SyntheticClosingManager {

  static buildDataset(indicators: Indicator[], template: Template, commentPlaceholder: string): Dataset {
    const year = new Date().getFullYear()
    const measures = referenceMeasures(year)
    const values = Object.fromEntries(indicators.map(indicator => [
      indicator.id,
      Object.fromEntries(measures.map(measure => [measure.key, valueFor(indicator, measure)])),
    ]))
    const slots = template.screens
      .flatMap(screen => screen.widgets)
      .map(widget => widget.comment)
      .filter((slot): slot is string => slot !== undefined)

    return {
      metadata: {
        schemaVersion: '1.0.0',
        generatedAt: new Date(year, 0, 1).toISOString(),
        generator: 'KeyMoments-Editor',
        entity: { name: template.label, legalForm: '', siret: '00000000000000' },
        currency: 'EUR',
        locale: 'fr-FR',
        exercice: { startDate: `${year}-01-01`, endDate: `${year}-12-31` },
        measures,
      },
      indicators,
      values,
      comments: Object.fromEntries(slots.map(slot => [slot, commentPlaceholder])),
    }
  }
}
