import { i18n } from '@pulse/common/i18n'
import { logger } from '@pulse/toolbox'
import keyMomentsClosing from '../__mocks__/json/key-moments.12345678900015.json'
import keyMomentsIndicators from '../__mocks__/json/key-moments.indicators.json'
import { assembleDataset } from '../utils/data.utils'
import { ReportManager } from './report.manager'
import { validateTemplate } from '../validation/key-moments.validation'
import keyMomentsEngagement from '../templates/key-moments.engagement.template.json'
import {
  BalanceSheetSide,
  ChartKind,
  ChartSeriesType,
  IndicatorSign,
  LineRole,
  MeasureNature,
  MeasureRole,
  Renderer,
  Trend,
  ValueKind,
} from '../enums/key-moments.enums'
import { EMPTY_VALUE } from '../const/key-moments.consts'
import type {
  BuildOptions,
  Card,
  Closing,
  Dataset,
  Indicators,
  MeasureConfig,
  ClosingMetadata,
  Template,
  WidgetConfig,
} from '../types/key-moments.types'

// No locale messages are ever loaded for this package's specs (doctrine:
// docs/guidelines/isolate-safe-tests.md — entities specs assert the i18n key,
// never the rendered wording), so `i18n.global.t('a.b.c')` returns 'a.b.c'
// verbatim, with no interpolation. Declared once for readability.
const PERCENTAGE_UNIT = 'keyMoments.units.percentage'
const POINTS_UNIT = 'keyMoments.units.points'

// Separators `Intl` writes in fr-FR currency, spelled out because they are
// invisible in the source: a narrow no-break space groups the thousands, a
// no-break space precedes the currency symbol.
const NARROW_NO_BREAK_SPACE = '\u202F'
const NO_BREAK_SPACE = '\u00A0'

function buildData(overrides: Partial<Dataset> = {}): Dataset {
  return {
    metadata: {
      schemaVersion: '5.0.0',
      generatedAt: '2026-07-26T09:00:00+02:00',
      generator: 'MomentCle-Export/1.0',
      entity: { name: 'SAS TEST', legalForm: 'SAS', siret: '12345678900015' },
      currency: 'EUR',
      locale: 'fr-FR',
      exercice: { startDate: '2025-01-01', endDate: '2025-12-31' },
      measures: [
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
        {
          key: 'poidsCaPct.N',
          nature: MeasureNature.RATIO,
          of: 'chiffre-affaires',
          period: 'N',
          kind: ValueKind.PERCENTAGE,
        },
      ],
    },
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
        id: 'taux-marge',
        label: 'Taux de marge',
        kind: ValueKind.PERCENTAGE,
        sign: IndicatorSign.INCOME,
      },
    ],
    values: {
      'chiffre-affaires': {
        'N': 2000, 'N-1': 1000, 'variation.N-1': 1000, 'variationPct.N-1': 100, 'poidsCaPct.N': 100,
      },
      'achats-consommes': {
        'N': 600, 'N-1': 500, 'variation.N-1': 100, 'variationPct.N-1': 20, 'poidsCaPct.N': 30,
      },
      'taux-marge': { 'N': 73, 'N-1': 71, 'variation.N-1': 2 },
    },
    comments: {},
    ...overrides,
  }
}

describe('ReportManager.findMeasure', () => {

  it('should find a measure the closing declares', () => {
    const measure = ReportManager.findMeasure('N-1', buildData().metadata)

    expect(measure).toEqual({
      key: 'N-1',
      nature: MeasureNature.PERIOD,
      closingDate: '2024-12-31',
    })
  })

  it('should find nothing for a key the closing does not declare', () => {
    expect(ReportManager.findMeasure('N-5', buildData().metadata)).toBeUndefined()
  })

  /**
   * A key is a name the export chose, never a rank the app decodes: nothing
   * here may deduce that `N-5` designates a fifth exercise.
   */
  it('should find a measure whatever its key looks like', () => {
    const data = buildData()
    data.metadata.measures.push({
      key: 'cloture-intermediaire',
      nature: MeasureNature.PERIOD,
      closingDate: '2025-06-30',
    })

    expect(ReportManager.findMeasure('cloture-intermediaire', data.metadata)?.key)
      .toBe('cloture-intermediaire')
  })
})

describe('ReportManager.resolvePeriodMeasures', () => {

  it('should keep the exercises only, in the order the closing declares them', () => {
    expect(ReportManager.resolvePeriodMeasures(buildData().metadata.measures)
      .map(measure => measure.key)).toEqual(['N', 'N-1'])
  })
})

describe('ReportManager.resolveComparisons', () => {

  it('should derive one comparison per reference period, most recent first', () => {
    const comparisons = ReportManager.resolveComparisons(buildComparableData().metadata)

    expect(comparisons.map(comparison => comparison.referenceKey)).toStrictEqual(['N-1', 'N-2'])
    expect(comparisons[0].variation?.key).toBe('variation.N-1')
    expect(comparisons[0].variationPct?.key).toBe('variationPct.N-1')
    expect(comparisons[1].variation?.key).toBe('variation.N-2')
    expect(comparisons[1].variationPct?.key).toBe('variationPct.N-2')
    expect(comparisons[1].current.key).toBe('N')
    expect(comparisons[1].reference.key).toBe('N-2')
  })

  /**
   * A variation between two past exercises is a legitimate figure, but it does
   * not describe a way of reading the document.
   */
  it('should ignore a variation that does not end on the current exercise', () => {
    const { metadata } = buildComparableData()
    // Annotated so the array literal is checked against `ClosingMetadata` as it
    // is built, rather than widening `nature` to the enum type before the call.
    const withPastVariation: ClosingMetadata = {
      ...metadata,
      measures: [
        ...metadata.measures.filter(measure => measure.key.endsWith('.N-2') === false),
        {
          key: 'variationOld',
          nature: MeasureNature.VARIATION,
          from: 'N-2',
          to: 'N-1',
        },
      ],
    }

    expect(ReportManager.resolveComparisons(withPastVariation)
      .map(comparison => comparison.referenceKey)).toStrictEqual(['N-1'])
  })

  it('should drop a period no variation compares to', () => {
    const { metadata } = buildComparableData()
    const withoutN2Variations = {
      ...metadata,
      measures: metadata.measures.filter(measure => measure.key.endsWith('.N-2') === false),
    }

    expect(ReportManager.resolveComparisons(withoutN2Variations)
      .map(comparison => comparison.referenceKey)).toStrictEqual(['N-1'])
  })

  /**
   * Unusable, and left in silence: a dictionary declaring a variation on an
   * exercise it never ships is a defect of the export, not of this build.
   */
  it('should ignore a variation comparing to a period the closing does not declare', () => {
    const { metadata } = buildComparableData()

    const comparisons = ReportManager.resolveComparisons({
      ...metadata,
      measures: [
        ...metadata.measures,
        { key: 'variation.N-9', nature: MeasureNature.VARIATION, from: 'N-9', to: 'N' },
      ],
    })

    expect(comparisons.map(comparison => comparison.referenceKey)).not.toContain('N-9')
  })

  it('should return nothing when the closing carries no exercise', () => {
    const { metadata } = buildComparableData()

    expect(ReportManager.resolveComparisons({ ...metadata, measures: [] })).toStrictEqual([])
  })
})

describe('ReportManager.buildColumnHeader', () => {

  it('should head a period column with its exercise over its closing month', () => {
    expect(ReportManager.buildColumnHeader({ measure: 'N' }, buildData()))
      .toStrictEqual({ title: 'N', caption: '12/2025' })
  })

  it('should head a ratio column with its denominator over its date', () => {
    const translate = vi.spyOn(i18n.global, 't')

    const header = ReportManager.buildColumnHeader({ measure: 'poidsCaPct.N' }, buildData())

    expect(translate).toHaveBeenCalledWith('keyMoments.columns.ratio', {
      indicator: 'Chiffre d\'affaires',
    })
    expect(header.caption).toBe('12/2025')
    translate.mockRestore()
  })

  /** Where width is scarce, an indicator that declares a short label uses it. */
  it('should head a ratio column with the short label of its denominator', () => {
    const translate = vi.spyOn(i18n.global, 't')
    const data = buildData()
    const [indicator] = data.indicators

    ReportManager.buildColumnHeader(
      { measure: 'poidsCaPct.N' },
      { ...data, indicators: [{ ...indicator, shortLabel: 'CA' }, ...data.indicators.slice(1)] },
    )

    expect(translate).toHaveBeenCalledWith('keyMoments.columns.ratio', {
      indicator: 'CA',
    })
    translate.mockRestore()
  })

  it('should tell an absolute variation from a relative one by its unit', () => {
    const data = buildData()

    expect(ReportManager.buildColumnHeader({ measure: 'variation.N-1' }, data).title)
      .toBe('keyMoments.columns.delta')
    expect(ReportManager.buildColumnHeader({ measure: 'variationPct.N-1' }, data).title)
      .toBe('keyMoments.columns.deltaPct')
  })

  it('should name the compared exercises on a variation column', () => {
    const translate = vi.spyOn(i18n.global, 't')

    ReportManager.buildColumnHeader({ measure: 'variation.N-2' }, buildComparableData())

    expect(translate).toHaveBeenCalledWith(
      'keyMoments.columns.delta',
      { from: 'N-2', to: 'N' },
    )
    expect(translate).toHaveBeenCalledWith(
      'keyMoments.columns.deltaCaption',
      { from: '12/2023', to: '12/2025' },
    )
    translate.mockRestore()
  })

  it('should name the compared exercises on a relative variation column', () => {
    const translate = vi.spyOn(i18n.global, 't')

    ReportManager.buildColumnHeader({ measure: 'variationPct.N-2' }, buildComparableData())

    expect(translate).toHaveBeenCalledWith(
      'keyMoments.columns.deltaPctCaption',
      { from: 'N-2', to: 'N' },
    )
    translate.mockRestore()
  })

  /** A label the template states names the column whole, second line included. */
  it('should head a column the template names with that name alone', () => {
    expect(ReportManager.buildColumnHeader({ measure: 'N', label: 'Exercice' }, buildData()))
      .toStrictEqual({ title: 'Exercice' })
  })

  /**
   * A column naming a measure the closing does not declare is dropped from the
   * table, but the editor still has to name it: its key is the only truth left.
   */
  it('should fall back on the key of a measure the closing does not declare', () => {
    expect(ReportManager.buildColumnHeader({ measure: 'variationPts' }, buildData()))
      .toStrictEqual({ title: 'variationPts' })
  })

  /** Read on one line, the caption is folded into the title between brackets. */
  it('should write the two lines of a header on one for the places with a single one', () => {
    expect(ReportManager.buildColumnLabel({ measure: 'N' }, buildData())).toBe('N (12/2025)')
  })

  it('should label a period with its calendar date whatever the timezone of the reader', () => {
    vi.stubEnv('TZ', 'America/Martinique')

    expect(ReportManager.buildColumnHeader({ measure: 'N' }, buildData()).caption)
      .toBe('12/2025')
  })

  it('should prefer the label written in the template', () => {
    const label = ReportManager.buildColumnLabel(
      { measure: 'N', label: 'Exercice courant' },
      buildData(),
    )

    expect(label).toBe('Exercice courant')
  })
})

describe('ReportManager.buildCell', () => {

  const data = buildData()

  it('should read the value of a period', () => {
    const cell = ReportManager.buildCell({ measure: 'N' }, 'chiffre-affaires', data)

    expect(cell.value).toBe(`2${NARROW_NO_BREAK_SPACE}000${NO_BREAK_SPACE}€`)
    expect(cell.trend).toBe(Trend.NEUTRAL)
  })

  it('should read the variation the closing carries and display its sign', () => {
    const cell = ReportManager.buildCell({ measure: 'variation.N-1' }, 'chiffre-affaires', data)

    expect(cell.value).toContain('+')
    expect(cell.trend).toBe(Trend.POSITIVE)
  })

  it('should read a rise of an expense as unfavourable', () => {
    const cell = ReportManager.buildCell({ measure: 'variation.N-1' }, 'achats-consommes', data)

    expect(cell.trend).toBe(Trend.NEGATIVE)
  })

  it('should read a relative variation as a percentage', () => {
    const cell = ReportManager.buildCell({ measure: 'variationPct.N-1' }, 'chiffre-affaires', data)

    expect(cell.value).toBe(`+100 ${PERCENTAGE_UNIT}`)
  })

  /**
   * The figure the export published is the one displayed, rounding included.
   * Recomputing it from the exercises would silently overrule the document that
   * makes the accounting truth — here, a variation the closing states as −3 %
   * while the two exercises would imply +100 %.
   */
  it('should display the shipped variation rather than what the exercises imply', () => {
    const cell = ReportManager.buildCell(
      { measure: 'variationPct.N-1' },
      'chiffre-affaires',
      buildData({
        values: { 'chiffre-affaires': { 'N': 2000, 'N-1': 1000, 'variationPct.N-1': -3 } },
      }),
    )

    expect(cell.value).toBe(`-3 ${PERCENTAGE_UNIT}`)
    expect(cell.trend).toBe(Trend.NEGATIVE)
  })

  it('should render a variation of a percentage indicator in points', () => {
    const cell = ReportManager.buildCell({ measure: 'variation.N-1' }, 'taux-marge', data)

    expect(cell.value).toBe(`+2 ${POINTS_UNIT}`)
  })

  it('should read a ratio as a percentage, without a trend', () => {
    const cell = ReportManager.buildCell({ measure: 'poidsCaPct.N' }, 'achats-consommes', data)

    expect(cell.value).toBe(`30 ${PERCENTAGE_UNIT}`)
    expect(cell.trend).toBe(Trend.NEUTRAL)
  })

  /**
   * The heart of the rule: a variation the closing does not ship is not
   * reconstituted from the exercises it would have compared, even when both are
   * there for the taking.
   */
  it('should leave a cell empty rather than reconstituting an absent variation', () => {
    const cell = ReportManager.buildCell(
      { measure: 'variation.N-1' },
      'chiffre-affaires',
      buildData({ values: { 'chiffre-affaires': { 'N': 2000, 'N-1': 1000 } } }),
    )

    expect(cell.value).toBe(EMPTY_VALUE)
    expect(cell.trend).toBe(Trend.NEUTRAL)
  })

  it('should leave a cell empty when the value is missing rather than reading it as zero', () => {
    const cell = ReportManager.buildCell(
      { measure: 'N-1' },
      'chiffre-affaires',
      buildData({ values: { 'chiffre-affaires': { N: 2000 } } }),
    )

    expect(cell.value).toBe(EMPTY_VALUE)
  })

  it('should leave a cell empty when the column names a measure the closing does not declare', () => {
    const cell = ReportManager.buildCell({ measure: 'variationPts' }, 'taux-marge', data)

    expect(cell.value).toBe(EMPTY_VALUE)
    expect(cell.trend).toBe(Trend.NEUTRAL)
  })

  it('should read a null variation as neutral', () => {
    const cell = ReportManager.buildCell(
      { measure: 'variation.N-1' },
      'chiffre-affaires',
      buildData({ values: { 'chiffre-affaires': { 'N': 1000, 'N-1': 1000, 'variation.N-1': 0 } } }),
    )

    expect(cell.trend).toBe(Trend.NEUTRAL)
  })
})

function buildReportData(): Dataset {
  return buildData({
    indicators: [
      ...buildData().indicators,
      {
        id: 'production-stockee',
        label: 'Production stockée',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.INCOME,
      },
      {
        id: 'total-actif',
        label: 'Total actif',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.INCOME,
        components: [{ indicator: 'chiffre-affaires' }, { indicator: 'achats-consommes' }],
      },
      {
        id: 'effectif',
        label: 'Effectif',
        kind: ValueKind.HEADCOUNT,
        sign: IndicatorSign.INCOME,
      },
      {
        id: 'treso-ouverture',
        label: 'Trésorerie ouverture',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.INCOME,
      },
      {
        id: 'treso-cloture',
        label: 'Trésorerie clôture',
        kind: ValueKind.AMOUNT,
        sign: IndicatorSign.INCOME,
      },
    ],
    values: {
      ...buildData().values,
      'total-actif': { N: 2600 },
      effectif: { 'N': 14, 'N-1': 12, 'variation.N-1': 2 },
      'treso-ouverture': { N: 1000 },
      'treso-cloture': { N: 1400 },
    },
    comments: { synthese: 'Un commentaire', 'graphe-ca': 'Un graphique' },
  })
}

/**
 * The reference data reduced to the single exercise a dossier has on its first
 * closing: a company created during the year has no N-1 to ship, so the closing
 * declares no variation and offers no comparison at all.
 */
function buildSingleExerciceData(): Dataset {
  const base = buildReportData()

  return {
    ...base,
    metadata: {
      ...base.metadata,
      measures: base.metadata.measures.filter(measure => measure.key === 'N'),
    },
    values: Object.fromEntries(Object.entries(base.values).map(([indicatorId, cells]) => [
      indicatorId,
      Object.fromEntries(Object.entries(cells).filter(([key]) => key === 'N')),
    ])),
  }
}

/**
 * The reference data with a third exercise and the variations comparing to it:
 * what a closing offering two readings looks like. Appending the period after
 * the others keeps the exercises ordered most recent first, which the manager
 * relies on.
 */
function buildComparableData(overrides: Partial<Dataset> = {}): Dataset {
  const base = buildReportData()

  return {
    ...base,
    metadata: {
      ...base.metadata,
      measures: [
        ...base.metadata.measures,
        { key: 'N-2', nature: MeasureNature.PERIOD, closingDate: '2023-12-31' },
        { key: 'variation.N-2', nature: MeasureNature.VARIATION, from: 'N-2', to: 'N' },
        {
          key: 'variationPct.N-2',
          nature: MeasureNature.VARIATION,
          from: 'N-2',
          to: 'N',
          kind: ValueKind.PERCENTAGE,
        },
      ],
    },
    values: {
      ...base.values,
      'chiffre-affaires': {
        ...base.values['chiffre-affaires'],
        'N-2': 800,
        'variation.N-2': 1200,
        'variationPct.N-2': 150,
      },
      'achats-consommes': {
        ...base.values['achats-consommes'],
        'N-2': 400,
        'variation.N-2': 200,
        'variationPct.N-2': 50,
      },
    },
    ...overrides,
  }
}

function buildTemplate(widgets: WidgetConfig[]): Template {
  return {
    version: '6.0.0',
    id: 'engagement',
    label: "Comptabilité d'engagement",
    defaultMeasures: [{ measure: 'N' }, { measure: 'N-1' }],
    screens: [{ id: 'activite', title: 'Votre activité', widgets }],
  }
}

const SYNTHESE_LINES = [
  { indicator: 'chiffre-affaires' },
  { indicator: 'achats-consommes', role: LineRole.SUBTOTAL },
  { indicator: 'production-stockee' },
]

const BILAN_LINES = [{ indicator: 'total-actif', role: LineRole.TOTAL }]

const TABLE_WIDGET: WidgetConfig = {
  id: 'w-synthese',
  display: { title: 'Synthèse de l\'activité', renderer: Renderer.TABLE },
  lines: SYNTHESE_LINES,
  comment: 'synthese',
}

/**
 * The reference widget switched to another renderer, the rest of its display
 * left alone. Most cases below only differ by what they ask to be drawn.
 */
function asRenderer(
  renderer: Renderer,
  overrides: Partial<WidgetConfig> = {},
): WidgetConfig {
  return { ...TABLE_WIDGET, display: { ...TABLE_WIDGET.display, renderer }, ...overrides }
}

describe('ReportManager.buildReport', () => {

  /**
   * The overline is an authored string, carried through untouched: the page
   * decides how to read it, the template decides what it says.
   */
  it('should carry the subtitle a screen states, and none when it states none', () => {
    const template = buildTemplate([TABLE_WIDGET])
    const withSubtitle = {
      ...template,
      screens: [{ ...template.screens[0], subtitle: "De votre chiffre d'affaires à votre marge" }],
    }

    expect(ReportManager.buildReport(buildReportData(), withSubtitle).screens[0].subtitle)
      .toBe("De votre chiffre d'affaires à votre marge")
    expect(ReportManager.buildReport(buildReportData(), template).screens[0].subtitle)
      .toBeUndefined()
  })

  it('should build a table from the lines of the widget, in the order of the template', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([TABLE_WIDGET]))
    const table = report.screens[0].widgets[0].table

    expect(table?.rows.map(row => row.id)).toEqual(['chiffre-affaires', 'achats-consommes'])
    expect(table?.columns.map(column => [column.title, column.caption]))
      .toEqual([['N', '12/2025'], ['N-1', '12/2024']])
  })

  it('should carry the definition of an indicator onto its row and its card', () => {
    const base = buildReportData()
    const data = {
      ...base,
      indicators: base.indicators.map(indicator => (indicator.id === 'chiffre-affaires'
        ? { ...indicator, description: 'Ventes de la période.' }
        : { ...indicator, description: null })),
    }

    const table = ReportManager.buildReport(data, buildTemplate([TABLE_WIDGET])).screens[0].widgets[0].table
    const cards = ReportManager.buildReport(data, buildTemplate([asRenderer(Renderer.CARDS)])).screens[0].widgets[0].cards

    expect(table?.rows.find(row => row.id === 'chiffre-affaires')?.description).toBe('Ventes de la période.')
    expect(table?.rows.find(row => row.id === 'achats-consommes')?.description).toBeUndefined()
    expect(cards?.find(card => card.id === 'chiffre-affaires')?.description).toBe('Ventes de la période.')
  })

  it('should drop a line carrying no value at all', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([TABLE_WIDGET]))

    expect(report.screens[0].widgets[0].table?.rows.map(row => row.id))
      .not.toContain('production-stockee')
  })

  /**
   * A line valued on an exercise the widget does not show would be a row of
   * blanks in the table, and a card with a title over nothing.
   */
  describe('a line valued on an exercise the widget does not show', () => {
    function buildDataWithOlderValueOnly(): Dataset {
      const data = buildReportData()

      data.metadata.measures.push({
        key: 'N-2',
        nature: MeasureNature.PERIOD,
        closingDate: '2023-12-31',
      })
      data.values['production-stockee'] = { 'N-2': 50 }

      return data
    }

    it('should drop its row from the table, the columns untouched', () => {
      const report = ReportManager.buildReport(
        buildDataWithOlderValueOnly(),
        buildTemplate([TABLE_WIDGET]),
      )
      const table = report.screens[0].widgets[0].table

      expect(table?.rows.map(row => row.id)).toEqual(['chiffre-affaires', 'achats-consommes'])
      expect(table?.columns.map(column => column.key)).toEqual(['N', 'N-1'])
    })

    it('should drop its card', () => {
      const report = ReportManager.buildReport(
        buildDataWithOlderValueOnly(),
        buildTemplate([asRenderer(Renderer.CARDS)]),
      )

      expect(report.screens[0].widgets[0].cards?.map(card => card.id))
        .toEqual(['chiffre-affaires', 'achats-consommes'])
    })

    /** A table with no row left has nothing to show: the widget goes, and its section with it. */
    it('should drop the whole widget when no line is left', () => {
      const data = buildDataWithOlderValueOnly()
      data.values['chiffre-affaires'] = { 'N-2': 10 }
      data.values['achats-consommes'] = { 'N-2': 10 }

      const report = ReportManager.buildReport(data, buildTemplate([TABLE_WIDGET]))

      expect(report.screens).toEqual([])
    })
  })

  it('should carry the role of a line', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([TABLE_WIDGET]))
    const row = report.screens[0].widgets[0].table?.rows[1]

    expect(row?.role).toBe(LineRole.SUBTOTAL)
  })

  it('should attach the editorial slot named by the widget', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([TABLE_WIDGET]))

    expect(report.screens[0].widgets[0].comment).toBe('Un commentaire')
  })

  it('should leave the comment empty when the slot does not exist', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{ ...TABLE_WIDGET, comment: 'absent' }]),
    )

    expect(report.screens[0].widgets[0].comment).toBe('')
  })

  /** The encart writes its contribution to that slot: it has to know its id. */
  it('should carry the id of the editorial slot a widget reads', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([TABLE_WIDGET]))

    expect(report.screens[0].widgets[0].commentSlotId).toBe('synthese')
  })

  it('should leave the slot undefined when the template attaches none', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{ ...TABLE_WIDGET, comment: undefined }]),
    )

    expect(report.screens[0].widgets[0].commentSlotId).toBeUndefined()
  })

  it('should render the title the template writes', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        display: { ...TABLE_WIDGET.display, title: 'Ce qu\'il faut retenir' },
      }]),
    )

    expect(report.screens[0].widgets[0].title).toBe('Ce qu\'il faut retenir')
  })

  it('should date a title on the closing of the exercise it names', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        display: { ...TABLE_WIDGET.display, title: 'Bilan N ({N}) en image' },
      }]),
    )

    expect(report.screens[0].widgets[0].title).toBe('Bilan N (12/2025) en image')
  })

  it('should fill every exercise a title names', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        display: { ...TABLE_WIDGET.display, title: 'De {N-1} à {N}' },
      }]),
    )

    expect(report.screens[0].widgets[0].title).toBe('De 12/2024 à 12/2025')
  })

  it('should write a title naming an exercise the closing does not declare as it stands', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        display: { ...TABLE_WIDGET.display, title: 'Bilan N-5 ({N-5}) en image' },
      }]),
    )

    expect(report.screens[0].widgets[0].title).toBe('Bilan N-5 (N-5) en image')
  })

  /**
   * A closing shipping a single exercise resolves `{reference}` to nothing.
   * Writing the role name would title a block « Bilan reference » over the
   * figures of the current exercise — the reference balance sheet read as the
   * current one — so the widget goes with its title.
   */
  it('should drop a widget whose title names an exercise the comparison cannot fill', () => {
    const report = ReportManager.buildReport(
      buildSingleExerciceData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        display: {
          ...TABLE_WIDGET.display,
          title: 'Bilan {reference:key} ({reference}) en image',
        },
      }]),
    )

    expect(report.screens).toEqual([])
  })

  /** The current exercise always resolves: naming it survives a lone closing. */
  it('should keep a widget naming the current exercise on a closing with no comparison', () => {
    const report = ReportManager.buildReport(
      buildSingleExerciceData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        display: {
          ...TABLE_WIDGET.display,
          title: 'Bilan {current:key} ({current}) en image',
        },
      }]),
    )

    expect(report.screens[0].widgets[0].title).toBe('Bilan N (12/2025) en image')
  })

  it('should fall back on the label of the section', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([TABLE_WIDGET]))

    expect(report.screens[0].widgets[0].title).toBe('Synthèse de l\'activité')
  })

  it('should read an explicit list of indicators in the order of the list', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'achats-consommes' }, { indicator: 'chiffre-affaires' }],
    }]))

    expect(report.screens[0].widgets[0].table?.rows.map(row => row.id))
      .toEqual(['achats-consommes', 'chiffre-affaires'])
  })

  it('should drop a column no displayed line carries', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'total-actif' }],
    }]))

    expect(report.screens[0].widgets[0].table?.columns.map(column => column.title))
      .toEqual(['N'])
  })

  it('should drop a widget whose every line names an unknown indicator', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'inconnu' }],
    }]))

    expect(report.screens).toHaveLength(0)
    expect(vi.mocked(logger.warn)).toHaveBeenCalled()
  })

  it('should drop a screen left without any widget', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'production-stockee' }],
    }]))

    expect(report.screens).toHaveLength(0)
  })

  it('should say when the renderer an author chose cannot be drawn, and name the one used instead', () => {
    const onWarning = vi.fn()
    const template = buildTemplate([TABLE_WIDGET])
    // no column to fill: a table cannot be drawn out of lines alone
    template.defaultMeasures = []

    const report = ReportManager.buildReport(buildReportData(), template, { onWarning })

    expect(report.screens[0].widgets[0].renderer).toBe(Renderer.CARDS)
    expect(onWarning).toHaveBeenCalledWith({
      subject: 'template',
      code: 'rendererUnavailable',
      details: ['w-synthese', Renderer.TABLE, Renderer.CARDS],
    })
  })

  it('should keep a screen left without any widget when the caller asks for it', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([]),
      { keepEmptyScreens: true },
    )

    expect(report.screens).toHaveLength(1)
    expect(report.screens[0].widgets).toEqual([])
  })

  it('should leave a hidden widget out, and the screen it empties with it', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{ ...TABLE_WIDGET, hidden: { widget: true } }]),
    )

    expect(report.screens).toHaveLength(0)
  })

  it('should leave a hidden screen out', () => {
    const template = buildTemplate([TABLE_WIDGET])
    template.screens[0].hidden = true

    const report = ReportManager.buildReport(buildReportData(), template)

    expect(report.screens).toHaveLength(0)
  })

  it('should leave a hidden column out of the table', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      measures: [{ measure: 'N' }, { measure: 'N-1', hidden: true }],
    }]))

    expect(report.screens[0].widgets[0].table?.columns).toHaveLength(1)
  })

  /**
   * The collaborator surface displays what it lets the firm bring back: an
   * element it cannot show is an element it cannot unhide.
   */
  it('should keep the hidden elements when the caller asks for them, and flag them', () => {
    const template = buildTemplate([{ ...TABLE_WIDGET, hidden: { widget: true } }])
    template.screens[0].hidden = true

    const report = ReportManager.buildReport(
      buildReportData(),
      template,
      { keepHidden: true },
    )

    expect(report.screens).toHaveLength(1)
    expect(report.screens[0].isHidden).toBe(true)
    expect(report.screens[0].widgets[0].isHidden).toBe(true)
  })

  /**
   * Hiding a card is a decision about the cards rendering, not about the data:
   * the same line keeps its row in the table.
   */
  it('should leave a hidden card out of the cards without touching the table', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CARDS),
      hidden: { cards: ['chiffre-affaires'] },
    }]))

    const widget = report.screens[0].widgets[0]
    expect(widget.cards?.map(card => card.id)).not.toContain('chiffre-affaires')
    expect(widget.table?.rows.map(row => row.id)).toContain('chiffre-affaires')
  })

  it('should keep a hidden card, flagged, when the hidden elements are kept', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{
        ...asRenderer(Renderer.CARDS),
        hidden: { cards: ['chiffre-affaires'] },
      }]),
      { keepHidden: true },
    )

    const card = report.screens[0].widgets[0].cards
      ?.find(candidate => candidate.id === 'chiffre-affaires')

    expect(card?.isHidden).toBe(true)
  })

  it('should flag a widget whose editorial slot is left out', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{ ...TABLE_WIDGET, hidden: { comment: true } }]),
    )

    expect(report.screens[0].widgets[0].isCommentHidden).toBe(true)
  })

  it('should keep a hidden column out even when the hidden elements are kept', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{
        ...TABLE_WIDGET,
        measures: [{ measure: 'N' }, { measure: 'N-1', hidden: true }],
      }]),
      { keepHidden: true },
    )

    expect(report.screens[0].widgets[0].table?.columns).toHaveLength(1)
  })

  it('should drop and report a indicator the closing does not describe', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'chiffre-affaires' }, { indicator: 'chiffre-daffaires' }],
    }]))

    expect(report.screens[0].widgets[0].table?.rows.map(row => row.id)).toEqual(['chiffre-affaires'])
    expect(vi.mocked(logger.warn))
      .toHaveBeenCalledWith('[KeyMoments] widget naming unknown indicators', ['chiffre-daffaires'], ['w-synthese'])
  })

  it('should drop and report a chart series naming a indicator the closing does not describe', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        series: [
          { indicator: 'chiffre-affaires', color: '#0E0F30' },
          { indicator: 'chiffre-daffaires', color: '#1AAB8E' },
        ],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.series).toHaveLength(1)
    expect(vi.mocked(logger.warn))
      .toHaveBeenCalledWith('[KeyMoments] widget naming unknown indicators', ['chiffre-daffaires'], ['w-synthese'])
  })

  it('should drop and report a composition stack naming a indicator the closing does not describe', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        period: 'N',
        stacks: ['total-actif', 'total-passif'],
        series: [
          { indicator: 'chiffre-affaires', color: '#0E0F30' },
          { indicator: 'achats-consommes', color: '#1AAB8E' },
        ],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.labels).toEqual([{ title: 'Total actif' }])
    expect(vi.mocked(logger.warn))
      .toHaveBeenCalledWith('[KeyMoments] widget naming unknown indicators', ['total-passif'], ['w-bilan'])
  })

  it('should build a period chart with the colors written in the template', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        series: [
          { indicator: 'chiffre-affaires', color: '#0E0F30' },
          { indicator: 'taux-marge', color: '#1AAB8E', type: ChartSeriesType.LINE },
        ],
      },
    }]))
    const chart = report.screens[0].widgets[0].chart

    expect(chart?.labels)
      .toEqual([{ title: 'N-1', caption: '12/2024' }, { title: 'N', caption: '12/2025' }])
    expect(chart?.series[0].color).toBe('#0E0F30')
    expect(chart?.series[1].isLine).toBe(true)
    expect(chart?.secondaryAxis?.color).toBe('#1AAB8E')
  })

  it('should plot only the exercises the chart names, oldest first', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        periods: ['N-1'],
        series: [{ indicator: 'chiffre-affaires', color: '#0E0F30' }],
      },
    }]))
    const chart = report.screens[0].widgets[0].chart

    expect(chart?.labels).toEqual([{ title: 'N-1', caption: '12/2024' }])
    expect(chart?.series[0].points).toHaveLength(1)
  })

  /**
   * A template is shared by entities that do not all carry the same
   * number of exercises: a rank this closing lacks is simply not plotted.
   */
  it('should ignore a rank the closing does not carry', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        periods: ['N', 'N-7'],
        series: [{ indicator: 'chiffre-affaires', color: '#0E0F30' }],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.labels)
      .toEqual([{ title: 'N', caption: '12/2025' }])
  })

  it('should drop a chart naming no exercise the closing carries', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CHART),
      chart: {
        kind: ChartKind.GROUPED_BARS,
        periods: ['N-7'],
        series: [{ indicator: 'chiffre-affaires', color: '#0E0F30' }],
      },
    }]))

    expect(report.screens[0].widgets[0].chart).toBeUndefined()
  })

  it('should build a composition chart from the components of its indicator', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        period: 'N',
        stacks: ['total-actif'],
      },
    }]))
    const chart = report.screens[0].widgets[0].chart

    expect(chart?.labels).toEqual([{ title: 'Total actif' }])
    expect(chart?.isStacked).toBe(true)
    expect(chart?.series.map(series => series.label))
      .toEqual(['Chiffre d\'affaires', 'Achats consommés'])
  })

  it('should drop a widget whose chart only plots a indicator the closing never valued', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CHART),
      lines: [{ indicator: 'production-stockee' }],
      chart: {
        kind: ChartKind.GROUPED_BARS,
        series: [{ indicator: 'production-stockee', color: '#0E0F30' }],
      },
    }]))

    expect(report.screens).toHaveLength(0)
  })

  it('should drop a composition column left without any segment', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        period: 'N',
        stacks: ['total-actif', 'taux-marge'],
      },
    }]))
    const chart = report.screens[0].widgets[0].chart

    expect(chart?.labels).toEqual([{ title: 'Total actif' }])
    expect(chart?.series[0].points).toHaveLength(1)
  })

  it('should fall back on the first available renderer when the requested one has no data', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([asRenderer(Renderer.CHART)]),
    )

    expect(report.screens[0].widgets[0].renderer).toBe(Renderer.TABLE)
  })

  it('should color a composition segment with the series declared for its indicator', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        stacks: ['total-actif'],
        series: [
          { indicator: 'chiffre-affaires', color: '#0E0F30' },
          { indicator: 'achats-consommes', color: '#1AAB8E' },
        ],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.series.map(series => series.color))
      .toEqual(['#0E0F30', '#1AAB8E'])
    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })

  it('should color a composition segment with the group its indicator belongs to', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        stacks: ['total-actif'],
        groups: [
          { label: 'Fonds de roulement', color: '#0E0F30', indicators: ['chiffre-affaires'] },
          { label: 'Trésorerie', color: '#B5F0EF', indicators: ['achats-consommes'] },
        ],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.series.map(series => series.color))
      .toEqual(['#0E0F30', '#B5F0EF'])
    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })

  it('should name the colors of a composition in its legend, in the order of the template', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        stacks: ['total-actif'],
        groups: [
          { label: 'Fonds de roulement', color: '#0E0F30', indicators: ['chiffre-affaires'] },
          { label: 'Trésorerie', color: '#B5F0EF', indicators: ['achats-consommes'] },
        ],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.legend).toEqual([
      { label: 'Fonds de roulement', color: '#0E0F30' },
      { label: 'Trésorerie', color: '#B5F0EF' },
    ])
  })

  /**
   * A legend is read against the picture: naming a colour that no brick of this
   * closing carries would have the reader look for something that is not there.
   */
  it('should leave a group no drawn term falls into out of the legend', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        stacks: ['total-actif'],
        groups: [
          { label: 'Fonds de roulement', color: '#0E0F30', indicators: ['chiffre-affaires'] },
          { label: 'Provisions', color: '#6B6D82', indicators: ['production-stockee'] },
        ],
      },
    }]))

    expect(report.screens[0].widgets[0].chart?.legend)
      .toEqual([{ label: 'Fonds de roulement', color: '#0E0F30' }])
  })

  it('should draw the balance sheet as bricks weighing their share of their own half', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.BALANCE_IMAGE },
      lines: BILAN_LINES,
      chart: {
        kind: ChartKind.COMPOSITION,
        period: 'N',
        stacks: ['total-actif'],
        groups: [
          { label: 'Fonds de roulement', color: '#0E0F30', indicators: ['chiffre-affaires'] },
          { label: 'Trésorerie', color: '#B5F0EF', indicators: ['achats-consommes'] },
        ],
      },
    }]))
    const [column] = report.screens[0].widgets[0].balanceImage?.columns ?? []

    expect(column.title).toBe('Total actif')
    expect(column.total).toBe('keyMoments.balanceImage.total')
    expect(column.bricks.map(brick => [brick.label, brick.color, Math.round(brick.heightPct)]))
      .toEqual([['Chiffre d\'affaires', '#0E0F30', 77], ['Achats consommés', '#B5F0EF', 23]])
  })

  /**
   * The height of a brick is its share of the aggregate as shipped, never of the
   * sum of the bricks: a half that does not add up says so by not filling
   * itself, which is the divergence the validator reports.
   */
  it('should weigh a brick against the shipped total, not against the sum of the bricks', () => {
    const data = buildReportData()
    const report = ReportManager.buildReport(
      { ...data, values: { ...data.values, 'total-actif': { 'N': 8000 } } },
      buildTemplate([{
        id: 'w-bilan',
        display: { title: 'Bilan en image', renderer: Renderer.BALANCE_IMAGE },
        lines: BILAN_LINES,
        chart: { kind: ChartKind.COMPOSITION, period: 'N', stacks: ['total-actif'] },
      }]),
    )
    const [column] = report.screens[0].widgets[0].balanceImage?.columns ?? []

    expect(column.bricks.map(brick => Math.round(brick.heightPct))).toEqual([25, 8])
  })

  /**
   * Only the geometry is weighed as a magnitude — the amount keeps the value the
   * closing shipped. A half shipped negative is a defect the validator
   * reports; drawing it upside down would answer it with a second one.
   */
  it('should draw a half shipped negative upright', () => {
    const data = buildReportData()
    const report = ReportManager.buildReport(
      { ...data, values: { ...data.values, 'total-actif': { 'N': -8000 } } },
      buildTemplate([{
        id: 'w-bilan',
        display: { title: 'Bilan en image', renderer: Renderer.BALANCE_IMAGE },
        lines: BILAN_LINES,
        chart: { kind: ChartKind.COMPOSITION, period: 'N', stacks: ['total-actif'] },
      }]),
    )
    const [column] = report.screens[0].widgets[0].balanceImage?.columns ?? []

    expect(column.bricks.map(brick => Math.round(brick.heightPct))).toEqual([25, 8])
  })

  /**
   * The header of a half names it briefly — « ACTIF », not « TOTAL ACTIF » —
   * which is what the short label of the aggregate is for.
   */
  it('should head a half with the short label of its aggregate when it carries one', () => {
    const data = buildReportData()
    const report = ReportManager.buildReport(
      {
        ...data,
        indicators: data.indicators.map(indicator => indicator.id === 'total-actif'
          ? { ...indicator, shortLabel: 'Actif' }
          : indicator),
      },
      buildTemplate([{
        id: 'w-bilan',
        display: { title: 'Bilan en image', renderer: Renderer.BALANCE_IMAGE },
        lines: BILAN_LINES,
        chart: { kind: ChartKind.COMPOSITION, period: 'N', stacks: ['total-actif'] },
      }]),
    )

    expect(report.screens[0].widgets[0].balanceImage?.columns[0].title).toBe('Actif')
  })

  it('should leave the balance image out of a widget that does not ask for it', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: { kind: ChartKind.COMPOSITION, period: 'N', stacks: ['total-actif'] },
    }]))

    expect(report.screens[0].widgets[0].balanceImage).toBeUndefined()
    expect(report.screens[0].widgets[0].availableRenderers)
      .not.toContain(Renderer.BALANCE_IMAGE)
  })

  it('should title the axes of a chart with what the template writes, unit included', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        primaryAxisTitle: 'Chiffre d\'affaires',
        secondaryAxisTitle: 'Taux de marge',
        series: [
          { indicator: 'chiffre-affaires', color: '#0E0F30' },
          { indicator: 'taux-marge', color: '#1AAB8E', type: ChartSeriesType.LINE },
        ],
      },
    }]))
    const chart = report.screens[0].widgets[0].chart

    expect(chart?.primaryAxisTitle).toBe('Chiffre d\'affaires (k€)')
    expect(chart?.primaryAxisSuffix).toBe('k€')
    expect(chart?.secondaryAxis?.title).toBe('Taux de marge')
  })

  /**
   * The unit is a consequence of how the figures are drawn, so an axis that is
   * not read in thousands announces none: the title and the graduations must
   * not be able to contradict each other.
   */
  it('should leave an axis of rates without a unit', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        primaryAxisTitle: 'Taux de marge',
        series: [{ indicator: 'taux-marge', color: '#0E0F30' }],
      },
    }]))
    const chart = report.screens[0].widgets[0].chart

    expect(chart?.primaryAxisTitle).toBe('Taux de marge')
    expect(chart?.primaryAxisSuffix).toBeUndefined()
  })

  it('should carry the color of its indicator on a card, when the widget asks for it', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CARDS),
      cards: { colored: true },
      chart: {
        kind: ChartKind.GROUPED_BARS,
        series: [{ indicator: 'chiffre-affaires', color: '#0E0F30' }],
      },
    }]))

    expect(report.screens[0].widgets[0].cards?.[0].color).toBe('#0E0F30')
  })

  /**
   * Declaring a palette for a chart must not repaint cards nobody meant to
   * touch: the colour of a card is a choice of the author, like the colour of a
   * series, and never a consequence of the two living in the same widget.
   */
  it('should leave a card uncolored when the widget did not ask for it', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CARDS),
      chart: {
        kind: ChartKind.GROUPED_BARS,
        series: [{ indicator: 'chiffre-affaires', color: '#0E0F30' }],
      },
    }]))

    expect(report.screens[0].widgets[0].cards?.[0].color).toBeUndefined()
  })

  it('should report a composition chart the template did not colorize', () => {
    ReportManager.buildReport(buildReportData(), buildTemplate([{
      id: 'w-bilan',
      display: { title: 'Bilan en image', renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: { kind: ChartKind.COMPOSITION, stacks: ['total-actif'] },
    }]))

    expect(vi.mocked(logger.warn))
      .toHaveBeenCalledWith('[KeyMoments] composition chart without declared colors', ['w-bilan'])
  })

  it('should offer every renderer its data supports', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      chart: {
        kind: ChartKind.GROUPED_BARS,
        series: [{ indicator: 'chiffre-affaires', color: '#0E0F30' }],
      },
    }]))

    expect(report.screens[0].widgets[0].availableRenderers).toEqual([
      Renderer.CHART,
      Renderer.TABLE,
      Renderer.CARDS,
    ])
  })

  it('should drop and report a column naming a measure the closing does not declare', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      measures: [{ measure: 'N' }, { measure: 'variationPts' }],
    }]))

    expect(report.screens[0].widgets[0].table?.columns.map(column => column.key)).toEqual(['N'])
    expect(vi.mocked(logger.warn))
      .toHaveBeenCalledWith('[KeyMoments] widget naming unknown measures', ['variationPts'], ['w-synthese'])
  })

  /**
   * A template declares the same column on every widget of a screen: one line
   * per widget reported thirty times the single fact that the closing does not
   * carry `N-2`, which is what makes a console unread.
   */
  it('should report one line naming every widget missing the same measure', () => {
    ReportManager.buildReport(buildReportData(), buildTemplate([
      { ...TABLE_WIDGET, id: 'w-un', measures: [{ measure: 'N' }, { measure: 'variationPts' }] },
      { ...TABLE_WIDGET, id: 'w-deux', measures: [{ measure: 'N' }, { measure: 'variationPts' }] },
    ]))

    expect(vi.mocked(logger.warn)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(logger.warn)).toHaveBeenCalledWith(
      '[KeyMoments] widget naming unknown measures',
      ['variationPts'],
      ['w-un', 'w-deux'],
    )
  })

  /** Two widgets missing two different measures stay two distinct reproaches. */
  it('should keep one line per distinct missing measure', () => {
    ReportManager.buildReport(buildReportData(), buildTemplate([
      { ...TABLE_WIDGET, id: 'w-un', measures: [{ measure: 'N' }, { measure: 'variationPts' }] },
      { ...TABLE_WIDGET, id: 'w-deux', measures: [{ measure: 'N' }, { measure: 'poids' }] },
    ]))

    expect(vi.mocked(logger.warn).mock.calls).toStrictEqual([
      ['[KeyMoments] widget naming unknown measures', ['variationPts'], ['w-un']],
      ['[KeyMoments] widget naming unknown measures', ['poids'], ['w-deux']],
    ])
  })

  /**
   * A card reads the dictionary of the closing, not the columns of its widget:
   * hiding a column must never repaint the cards of the report.
   */
  it('should show the two most recent exercises and both readings of the variation on a card', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CARDS),
      measures: [{ measure: 'N' }],
    }]))
    const card = report.screens[0].widgets[0].cards?.[0]

    expect(card?.value).toBe(`2${NARROW_NO_BREAK_SPACE}000${NO_BREAK_SPACE}€`)
    expect(card?.previous?.label).toBe('N-1 (12/2024)')
    expect(card?.variation?.value).toBe(`+1${NARROW_NO_BREAK_SPACE}000${NO_BREAK_SPACE}€`)
    expect(card?.variationPct?.value).toBe(`+100 ${PERCENTAGE_UNIT}`)
  })

  it('should show no variation on a card the closing gives none for', () => {
    const report = ReportManager.buildReport(
      buildData({
        indicators: buildReportData().indicators,
        values: { 'chiffre-affaires': { 'N': 2000, 'N-1': 1000 } },
      }),
      buildTemplate([asRenderer(Renderer.CARDS)]),
    )

    expect(report.screens[0].widgets[0].cards?.[0].variation).toBeUndefined()
  })

  const BRIDGE_WIDGET: WidgetConfig = {
    id: 'w-bridge',
    display: { title: 'Votre trésorerie', renderer: Renderer.WATERFALL },
    measures: [{ measure: 'N' }],
    lines: [
      { indicator: 'treso-ouverture', role: LineRole.TOTAL },
      { indicator: 'chiffre-affaires' },
      { indicator: 'treso-cloture', role: LineRole.TOTAL },
    ],
  }

  /**
   * A balance is drawn from zero and restarts the running total; a movement
   * floats on it. Nothing else is what a waterfall is.
   */
  it('should stack the movements of a waterfall on the running balance', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([BRIDGE_WIDGET]))
    const steps = report.screens[0].widgets[0].waterfall?.steps

    expect(steps?.map(step => [step.from, step.to])).toEqual([[0, 1000], [1000, 3000], [0, 1400]])
    expect(steps?.map(step => step.kind)).toEqual(['balance', 'rise', 'balance'])
  })

  it('should read a negative movement as a fall', () => {
    const data = buildReportData()
    data.values['chiffre-affaires'].N = -500

    const report = ReportManager.buildReport(data, buildTemplate([BRIDGE_WIDGET]))

    expect(report.screens[0].widgets[0].waterfall?.steps[1].kind).toBe('fall')
  })

  it('should write the shipped value above a step, sign included', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([BRIDGE_WIDGET]))
    const steps = report.screens[0].widgets[0].waterfall?.steps

    expect(steps?.[1].text).toContain('+')
    expect(steps?.[0].text).not.toContain('+')
  })

  /**
   * A bridge that does not close is a defect of the export: the last bar lands
   * beside the closing balance, where the figures put it. Never absorbed, and
   * never reproached here: the figures answer to whoever produces them.
   */
  it('should draw a waterfall whose movements miss the closing balance, without a word', () => {
    const data = buildReportData()
    data.values['treso-cloture'].N = 9999

    const report = ReportManager.buildReport(data, buildTemplate([BRIDGE_WIDGET]))
    const steps = report.screens[0].widgets[0].waterfall?.steps

    expect(steps?.[steps.length - 1].to).toBe(9999)
    expect(vi.mocked(logger.warn)).not.toHaveBeenCalled()
  })

  it('should split a balance sheet in two tables, by the side of each line', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.BALANCE_SHEET),
      lines: [
        { indicator: 'chiffre-affaires', side: BalanceSheetSide.ASSETS },
        { indicator: 'achats-consommes', side: BalanceSheetSide.LIABILITIES },
      ],
    }]))
    const balanceSheet = report.screens[0].widgets[0].balanceSheet

    expect(balanceSheet?.assets.rows.map(row => row.id)).toEqual(['chiffre-affaires'])
    expect(balanceSheet?.liabilities.rows.map(row => row.id)).toEqual(['achats-consommes'])
  })

  it('should offer no balance sheet when a side is left empty', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.BALANCE_SHEET),
      lines: [{ indicator: 'chiffre-affaires', side: BalanceSheetSide.ASSETS }],
    }]))

    expect(report.screens[0].widgets[0].balanceSheet).toBeUndefined()
    expect(report.screens[0].widgets[0].renderer).toBe(Renderer.TABLE)
  })

  it('should group a narrative into the blocks its subtotals close', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.NARRATIVE),
      lines: [
        { indicator: 'chiffre-affaires' },
        { indicator: 'achats-consommes', role: LineRole.SUBTOTAL },
        { indicator: 'total-actif', role: LineRole.TOTAL },
      ],
    }]))
    const narrative = report.screens[0].widgets[0].narrative

    expect(narrative?.blocks).toHaveLength(1)
    expect(narrative?.blocks[0].letter).toBe('A')
    expect(narrative?.blocks[0].lines.map(line => line.id)).toEqual(['chiffre-affaires'])
    expect(narrative?.blocks[0].total?.id).toBe('achats-consommes')
    expect(narrative?.footer.map(line => line.id)).toEqual(['total-actif'])
  })

  /** The starting balance is what the blocks move, not a term of the first. */
  it('should open a narrative on the memo lines read before its first block', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.NARRATIVE),
      lines: [
        { indicator: 'total-actif', role: LineRole.MEMO },
        { indicator: 'chiffre-affaires' },
        { indicator: 'achats-consommes', role: LineRole.SUBTOTAL },
      ],
    }]))
    const narrative = report.screens[0].widgets[0].narrative

    expect(narrative?.head.map(line => line.id)).toEqual(['total-actif'])
    expect(narrative?.blocks[0].lines.map(line => line.id)).toEqual(['chiffre-affaires'])
  })

  it('should read every amount in thousands when the page asks for it', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([TABLE_WIDGET]),
      { inThousands: true },
    )

    expect(report.screens[0].widgets[0].table?.rows[0].cells.N.value)
      .toBe(`2${NO_BREAK_SPACE}k€`)
  })

  /** `Intl` keeps the sign of `-0,4` and would write `-0 k€`, which reads as an error. */
  it('should write an amount that rounds to nothing as a plain zero in thousands', () => {
    const data = buildReportData()
    data.values['chiffre-affaires'].N = -400
    data.values['chiffre-affaires']['variation.N-1'] = -400

    const report = ReportManager.buildReport(
      data,
      buildTemplate([{ ...TABLE_WIDGET, measures: [{ measure: 'N' }, { measure: 'variation.N-1' }] }]),
      { inThousands: true },
    )
    const cells = report.screens[0].widgets[0].table?.rows[0].cells

    expect(cells?.N.value).toBe(`0${NO_BREAK_SPACE}k€`)
    expect(cells?.['variation.N-1'].value).toBe(`0${NO_BREAK_SPACE}k€`)
  })

  it('should leave a rate alone when the amounts are read in thousands', () => {
    const report = ReportManager.buildReport(
      buildReportData(),
      buildTemplate([{ ...TABLE_WIDGET, lines: [{ indicator: 'taux-marge' }] }]),
      { inThousands: true },
    )

    expect(report.screens[0].widgets[0].table?.rows[0].cells.N.value)
      .toBe(`73 ${PERCENTAGE_UNIT}`)
  })

  /**
   * The unit of a headcount is carried by its label, « Effectif en équivalent
   * temps plein (ETP) », and written nowhere else: the four figures of the line
   * are read under it, and repeating « ETP » on each of them says nothing more.
   */
  it('should write a headcount bare, its unit being carried by its label', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'effectif' }],
    }]))

    expect(report.screens[0].widgets[0].table?.rows[0].cells.N.value).toBe('14')
  })

  it('should write the variation of a headcount bare too, with its sign', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...TABLE_WIDGET,
      lines: [{ indicator: 'effectif' }],
      measures: [{ role: MeasureRole.VARIATION }],
    }]))

    expect(report.screens[0].widgets[0].table?.rows[0].cells['variation.N-1'].value).toBe('+2')
  })

  it('should highlight the first card when the widget asks for a hero', () => {
    const report = ReportManager.buildReport(buildReportData(), buildTemplate([{
      ...asRenderer(Renderer.CARDS),
      cards: { heroFirst: true },
    }]))

    expect(report.screens[0].widgets[0].cards?.[0].isHighlighted).toBe(true)
    expect(report.screens[0].widgets[0].cards?.[1].isHighlighted).toBe(false)
  })
})

describe('ReportManager measure roles', () => {

  /** Columns the reference widget ends up displaying, under given options. */
  function buildColumnKeysOf(
    measures: MeasureConfig[],
    options: BuildOptions = {},
    data: Dataset = buildComparableData(),
  ): string[] {
    const report = ReportManager.buildReport(
      data,
      buildTemplate([{ ...TABLE_WIDGET, measures }]),
      options,
    )

    return (report.screens[0]?.widgets[0]?.table?.columns ?? []).map(column => column.key)
  }

  const FULL_MEASURES: MeasureConfig[] = [
    { measure: 'N' },
    { measure: 'N-1' },
    { measure: 'N-2' },
    { role: MeasureRole.VARIATION },
    { role: MeasureRole.VARIATION_PCT },
  ]

  /**
   * The whole point of the switch: the exercises displayed do not move, only
   * the two variations change the measure they read.
   */
  it('should resolve a role against the comparison being read', () => {
    expect(buildColumnKeysOf(FULL_MEASURES))
      .toStrictEqual(['N', 'N-1', 'N-2', 'variation.N-1', 'variationPct.N-1'])
    expect(buildColumnKeysOf(FULL_MEASURES, { referenceKey: 'N-2' }))
      .toStrictEqual(['N', 'N-1', 'N-2', 'variation.N-2', 'variationPct.N-2'])
  })

  it('should leave a named measure alone whatever the comparison', () => {
    expect(buildColumnKeysOf([{ measure: 'variation.N-1' }], { referenceKey: 'N-2' }))
      .toStrictEqual(['variation.N-1'])
  })

  /** A stale choice must never empty a report. */
  it('should fall back on the first comparison when the reference is unknown', () => {
    expect(buildColumnKeysOf(FULL_MEASURES, { referenceKey: 'N-9' }))
      .toStrictEqual(['N', 'N-1', 'N-2', 'variation.N-1', 'variationPct.N-1'])
  })

  it('should drop and report a role the closing cannot fill', () => {
    const report = vi.spyOn(logger, 'warn').mockImplementation(() => undefined)
    const data = buildComparableData()
    // a closing shipping only absolute variations cannot fill the relative role
    const withoutRelative: Dataset = {
      ...data,
      metadata: {
        ...data.metadata,
        measures: data.metadata.measures
          .filter(measure => measure.key.startsWith('variationPct') === false),
      },
    }

    const columns = buildColumnKeysOf(
      [{ measure: 'N' }, { role: MeasureRole.VARIATION_PCT }],
      {},
      withoutRelative,
    )

    expect(columns).toStrictEqual(['N'])
    expect(report).toHaveBeenCalledWith(
      '[KeyMoments] widget naming a role the closing cannot fill',
      MeasureRole.VARIATION_PCT,
      ['w-synthese'],
    )
    report.mockRestore()
  })
})

describe('ReportManager period roles', () => {

  /** The reference widget reading its composition on a given exercise. */
  function buildBilanWidget(period: string, title = 'Bilan en image'): WidgetConfig {
    return {
      id: 'w-bilan',
      display: { title, renderer: Renderer.CHART },
      lines: BILAN_LINES,
      chart: { kind: ChartKind.COMPOSITION, period, stacks: ['total-actif'] },
    }
  }

  /** The figures that composition ends up drawing, under given options. */
  function buildCompositionValues(
    period: string,
    options: BuildOptions = {},
    data: Dataset = buildComparableData(),
  ): (number | null)[] {
    const report = ReportManager.buildReport(
      data,
      buildTemplate([buildBilanWidget(period)]),
      options,
    )

    return (report.screens[0]?.widgets[0]?.chart?.series ?? [])
      .map(series => series.points[0].value)
  }

  /**
   * The whole point of the role: the balance sheet drawn beside the current one
   * is the exercise being compared to, and follows the reader from N-1 to N-2.
   */
  it('should read a composition on the exercise the comparison puts in the place it names', () => {
    expect(buildCompositionValues('reference')).toStrictEqual([1000, 500])
    expect(buildCompositionValues('reference', { referenceKey: 'N-2' })).toStrictEqual([800, 400])
  })

  it('should read the current exercise whatever the comparison', () => {
    expect(buildCompositionValues('current', { referenceKey: 'N-2' })).toStrictEqual([2000, 600])
  })

  it('should leave a composition naming its exercise alone whatever the comparison', () => {
    expect(buildCompositionValues('N-1', { referenceKey: 'N-2' })).toStrictEqual([1000, 500])
  })

  /**
   * A closing shipping no variation at all offers no comparison, so there is no
   * reference exercise to draw: the composition is dropped rather than silently
   * rebased onto another exercise.
   */
  it('should drop a composition naming a reference the closing offers no comparison for', () => {
    const data = buildComparableData()
    const withoutVariation: Dataset = {
      ...data,
      metadata: {
        ...data.metadata,
        measures: data.metadata.measures
          .filter(measure => measure.nature !== MeasureNature.VARIATION),
      },
    }
    const report = ReportManager.buildReport(
      withoutVariation,
      buildTemplate([buildBilanWidget('reference')]),
    )

    expect(report.screens[0].widgets[0].chart).toBeUndefined()
    expect(report.screens[0].widgets[0].availableRenderers).not.toContain(Renderer.CHART)
  })

  /** A title cannot spell out an exercise it does not choose: it names it too. */
  it('should write the key and the closing of the exercise a title names by its place', () => {
    const title = 'Bilan {reference:key} ({reference}) en image'

    expect(ReportManager.buildReport(
      buildComparableData(),
      buildTemplate([buildBilanWidget('reference', title)]),
    ).screens[0].widgets[0].title).toBe('Bilan N-1 (12/2024) en image')

    expect(ReportManager.buildReport(
      buildComparableData(),
      buildTemplate([buildBilanWidget('reference', title)]),
      { referenceKey: 'N-2' },
    ).screens[0].widgets[0].title).toBe('Bilan N-2 (12/2023) en image')
  })

  it('should write the current exercise of a title whatever the comparison', () => {
    const report = ReportManager.buildReport(
      buildComparableData(),
      buildTemplate([buildBilanWidget('current', 'Bilan {current:key} ({current}) en image')]),
      { referenceKey: 'N-2' },
    )

    expect(report.screens[0].widgets[0].title).toBe('Bilan N (12/2025) en image')
  })
})

describe('ReportManager cards under a comparison', () => {

  /** Cards the reference widget ends up displaying, under given options. */
  function buildCardsOf(
    options: BuildOptions = {},
    data: Dataset = buildComparableData(),
  ): Card[] {
    const report = ReportManager.buildReport(
      data,
      buildTemplate([asRenderer(Renderer.CARDS)]),
      options,
    )

    return report.screens[0]?.widgets[0]?.cards ?? []
  }

  it('should read the reference of the comparison in the footer', () => {
    expect(buildCardsOf()[0].previous?.label).toBe('N-1 (12/2024)')
    expect(buildCardsOf({ referenceKey: 'N-2' })[0].previous?.label).toBe('N-2 (12/2023)')
  })

  it('should read the relative variation of the comparison in the chip', () => {
    // chiffre-affaires: +100 % against N-1, +150 % against N-2
    expect(buildCardsOf()[0].variation?.value)
      .not.toBe(buildCardsOf({ referenceKey: 'N-2' })[0].variation?.value)
  })

  it('should show no chip when the comparison ships no variation for the indicator', () => {
    const cards = buildCardsOf({}, buildComparableData({
      values: { 'chiffre-affaires': { 'N': 2000, 'N-1': 1000, 'N-2': 800 } },
    }))

    expect(cards[0].variation).toBeUndefined()
  })
})

describe('ReportManager measure roles over the real documents', () => {

  // maps a role's default-mode key to its N-2 substitution
  const SUBSTITUTED: Record<string, string> = {
    'variation.N-1': 'variation.N-2',
    'variationPct.N-1': 'variationPct.N-2',
  }

  /** Column keys of every widget, real engagement template on the real closing. */
  function columnKeysOf(options: BuildOptions) {
    const data = assembleDataset(
      keyMomentsIndicators as unknown as Indicators,
      keyMomentsClosing as unknown as Closing,
    )
    const template = validateTemplate(keyMomentsEngagement)

    return ReportManager.buildReport(data, template, options).screens
      .flatMap(screen => screen.widgets)
      .map(widget => ({ id: widget.id, keys: widget.table?.columns.map(column => column.key) }))
  }

  /**
   * The invariant the whole chantier claims: switching comparison rebases what
   * is compared, it never changes what is shown. Runs on the real synthese
   * widget, whose measures mix three literals, two roles and a trailing
   * literal (`poidsCaPct.N`) positioned after the roles — the one shape a
   * map/filter refactor of `resolveMeasures` would silently break.
   */
  it('should substitute only the variation keys when the reader switches comparison', () => {
    const onN1 = columnKeysOf({})
    const onN2 = columnKeysOf({ referenceKey: 'N-2' })

    expect(onN2).toStrictEqual(onN1.map(widget => ({
      ...widget,
      keys: widget.keys?.map(key => SUBSTITUTED[key] ?? key),
    })))
  })
})
