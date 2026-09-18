import { i18n } from '@pulse/common/i18n'
import { logger } from '@pulse/toolbox'
import { DEFAULT_WIDGET_SPAN, EMPTY_VALUE } from '../const/key-moments.consts'
import {
  BalanceSheetSide,
  ChartKind,
  ChartSeriesType,
  IndicatorSign,
  LineRole,
  MeasureNature,
  MeasureRole,
  PeriodRole,
  Renderer,
  Trend,
  ValueKind,
  WaterfallStepKind,
} from '../enums/key-moments.enums'
import { formatCalendarMonthYear } from '../utils/date.utils'
import type {
  BalanceImageBrick,
  BalanceImageColumn,
  BalanceImageView,
  BalanceSheetView,
  BuildOptions,
  ReportWarning,
  ReportWarningCode,
  Card,
  CardDetail,
  Cell,
  ColumnHeader,
  ChartConfig,
  ChartLegendEntry,
  ChartPoint,
  ChartSeries,
  ChartSeriesConfig,
  ChartView,
  NamedMeasureConfig,
  Indicator,
  Dataset,
  Comparison,
  Measure,
  ClosingMetadata,
  NarrativeBlock,
  NarrativeLine,
  NarrativeView,
  PeriodMeasure,
  IndicatorComponent,
  Template,
  Report,
  Row,
  Screen,
  TableView,
  VariationMeasure,
  WaterfallStep,
  WaterfallView,
  Widget,
  WidgetConfig,
} from '../types/key-moments.types'

/** Options driving how a value reads, never what it is worth. */
interface FormatOptions {
  hasSign?: boolean
  inThousands?: boolean
}

const THOUSAND = 1000

/**
 * `Intl` separates an amount from its currency with a no-break space, and the
 * thousands notation is built by hand: it has to match.
 */
const NO_BREAK_SPACE = '\u00A0'

/**
 * In a title, `{N}` names the exercise `N` and is written as its closing;
 * `{N:key}` writes the key itself, which is what a title naming an exercise it
 * does not choose — `{reference:key}` — has to do.
 */
const TITLE_PERIOD_PLACEHOLDER = /\{([^{}:]+)(?::(key))?\}/g

/** Blocks of a narrative are read A, B, C… */
const NARRATIVE_FIRST_LETTER_CODE = 'A'.charCodeAt(0)

/** Ramp of the fallback tints, in percent of lightness. */
const DERIVED_TINT_BASE_LIGHTNESS = 30
const DERIVED_TINT_LIGHTNESS_STEP = 11

/** A line of a widget, resolved against the data: its indicator and its role. */
interface ResolvedLine {
  indicator: Indicator
  /** What the line is an effect of; absent when the vocabulary does not know it */
  reference?: Indicator
  role?: LineRole
  side?: BalanceSheetSide
}

/** A configured series paired with the indicator it resolves to. */
interface ResolvedChartSeries {
  config: ChartSeriesConfig
  indicator: Indicator
}

/** One term of a stack, weighed on the period the chart reads. */
interface StackSegment {
  indicator: Indicator
  value: number
  /** Rank inside its own stack, only used to derive a fallback tint */
  rank: number
}

/** One column of a composition chart: an aggregate and the terms it stacks. */
interface CompositionColumn {
  indicator: Indicator
  segments: StackSegment[]
}

/** How every reader of this file reports what it could not read. */
type ReportWarn = (subject: ReportWarning['subject'], code: ReportWarningCode, ...details: unknown[]) => void

/** How the logger words each warning. What an author reads is translated. */
const WARNING_MESSAGES: Record<ReportWarningCode, string> = {
  unknownRole: '[KeyMoments] widget naming a role the closing cannot fill',
  rendererUnavailable: '[KeyMoments] widget asking for a renderer its data cannot fill',
  unknownIndicators: '[KeyMoments] widget naming unknown indicators',
  unknownMeasures: '[KeyMoments] widget naming unknown measures',
  chartWithoutColors: '[KeyMoments] composition chart without declared colors',
}

/**
 * Logs one line per distinct thing to reproach, naming every widget that
 * raises it. A template declares the same column on every widget of a screen,
 * so a closing that does not carry it was reported thirty times for one single
 * fact — and thirty lines is what makes a console unread.
 *
 * Grouping is on everything but the widget id, which every warning names
 * first: two widgets missing `N-2` read as one line, where a widget missing
 * `N-2` and another missing `N-3` stay two.
 */
function flushWarnings(warnings: ReportWarning[]): void {
  const groups = new Map<string, { code: ReportWarningCode, reproach: unknown[], widgetIds: string[] }>()

  warnings.forEach(({ code, details }) => {
    const [widgetId, ...reproach] = details
    const key = `${code} ${JSON.stringify(reproach)}`
    const group = groups.get(key) ?? { code, reproach, widgetIds: [] }

    group.widgetIds.push(String(widgetId))
    groups.set(key, group)
  })

  groups.forEach(({ code, reproach, widgetIds }) => {
    logger.warn(WARNING_MESSAGES[code], ...reproach, widgetIds)
  })
}

/** Context shared by every widget of a report build. */
interface BuildContext {
  warn: ReportWarn
  data: Dataset
  template: Template
  indicatorsById: Map<string, Indicator>
  /** Editing keeps the hidden elements, so that they can be brought back */
  keepHidden: boolean
  /** Reads every amount in thousands, for the whole page at once */
  inThousands: boolean
  /** Comparison applied; absent when the closing ships no variation at all */
  comparison?: Comparison
}

export class ReportManager {

  /**
   * Turns data + template into the view model consumed by the page. The
   * template only names data ids, and a name the closing of this entity does
   * not carry degrades rather than breaks: the widget is dropped and reported,
   * as are the screens left without any widget.
   *
   * Hidden elements are left out, unless the caller asks to keep them: the
   * collaborator surface displays them faded, because an element it cannot show
   * is an element it cannot bring back.
   */
  static buildReport(
    data: Dataset,
    template: Template,
    options: BuildOptions = {},
  ): Report {
    // held until the report is built rather than logged on the spot, so that
    // the same reproach raised by twenty widgets reads as one line
    const collected: ReportWarning[] = []
    const warn: ReportWarn = options.onWarning === undefined
      ? (subject, code, ...details) => collected.push({ subject, code, details })
      : (subject, code, ...details) => options.onWarning?.({ subject, code, details })
    const comparisons = ReportManager.resolveComparisons(data.metadata)
    const context: BuildContext = {
      warn,
      data,
      template,
      indicatorsById: new Map(data.indicators.map(indicator => [indicator.id, indicator])),
      keepHidden: options.keepHidden === true,
      inThousands: options.inThousands === true,
      // a stale or unknown key falls back rather than emptying the report
      comparison: comparisons.find(candidate => candidate.referenceKey === options.referenceKey)
        ?? comparisons[0],
    }

    const report: Report = {
      entity: data.metadata.entity,
      screens: template.screens
        .filter(screen => context.keepHidden === true || screen.hidden !== true)
        .map<Screen>(screen => ({
          id: screen.id,
          title: screen.title,
          subtitle: screen.subtitle,
          isHidden: screen.hidden === true,
          widgets: screen.widgets
            .filter(widgetConfig => context.keepHidden === true || widgetConfig.hidden?.widget !== true)
            .map(widgetConfig => ReportManager.buildWidget(widgetConfig, context))
            .filter((widget): widget is Widget => widget !== undefined),
        }))
        .filter(screen => options.keepEmptyScreens === true || screen.widgets.length > 0),
    }

    flushWarnings(collected)

    return report
  }

  /**
   * Builds every representation the data of a widget supports, so that
   * switching renderer stays a display toggle and never a reload. A widget no
   * renderer can display is dropped.
   */
  private static buildWidget(
    widgetConfig: WidgetConfig,
    context: BuildContext,
  ): Widget | undefined {
    const lines = ReportManager.resolveLines(widgetConfig, context)
    const measures = ReportManager.resolveMeasures(widgetConfig, context)
    const chart = ReportManager.buildChart(widgetConfig, context)
    const table = ReportManager.buildTable(widgetConfig, lines, measures, context)
    const cards = ReportManager.buildCards(widgetConfig, lines, context)
    const waterfall = ReportManager.buildWaterfall(widgetConfig, lines, measures, context)
    const balanceSheet = ReportManager.buildBalanceSheet(widgetConfig, lines, measures, context)
    const balanceImage = ReportManager.buildBalanceImage(widgetConfig, context)
    const narrative = ReportManager.buildNarrative(widgetConfig, lines, measures, context)
    const availableRenderers = [
      ...(chart === undefined ? [] : [Renderer.CHART]),
      ...(waterfall === undefined ? [] : [Renderer.WATERFALL]),
      ...(balanceImage === undefined ? [] : [Renderer.BALANCE_IMAGE]),
      ...(balanceSheet === undefined ? [] : [Renderer.BALANCE_SHEET]),
      ...(narrative === undefined ? [] : [Renderer.NARRATIVE]),
      ...(table === undefined ? [] : [Renderer.TABLE]),
      ...(cards.length === 0 ? [] : [Renderer.CARDS]),
    ]

    // a widget whose title names an exercise the comparison cannot fill has
    // nothing it could honestly be called: it goes with its title
    const title = ReportManager.resolveTitle(widgetConfig.display.title, context)

    if (availableRenderers.length === 0 || title === undefined) {
      return undefined
    }

    const asked = widgetConfig.display.renderer
    const renderer = availableRenderers.includes(asked) === true ? asked : availableRenderers[0]

    // the representation an author chose is never swapped without a word: what
    // it would need — a column to fill, a line to draw — is theirs to declare
    if (renderer !== asked) {
      context.warn('template', 'rendererUnavailable', widgetConfig.id, asked, renderer)
    }

    return {
      id: widgetConfig.id,
      title,
      comment: context.data.comments[widgetConfig.comment ?? ''] ?? '',
      commentSlotId: widgetConfig.comment,
      span: widgetConfig.display.span ?? DEFAULT_WIDGET_SPAN,
      renderer,
      availableRenderers,
      table,
      cards: cards.length === 0 ? undefined : cards,
      chart,
      waterfall,
      balanceSheet,
      balanceImage,
      narrative,
      isHidden: widgetConfig.hidden?.widget === true,
      isCommentHidden: widgetConfig.hidden?.comment === true,
    }
  }

  /**
   * Measures of a widget with every role resolved against the comparison being
   * read. Everything downstream works on named measures only, which is what
   * keeps a switch of reference from reaching the cells: a role is a way of
   * authoring a measure, never a second kind of measure.
   */
  private static resolveMeasures(
    widgetConfig: WidgetConfig,
    context: BuildContext,
  ): NamedMeasureConfig[] {
    const declared = widgetConfig.measures ?? context.template.defaultMeasures

    return declared
      .map<NamedMeasureConfig | undefined>(entry => {
        if ('measure' in entry) {
          return entry
        }

        const measure = ReportManager.resolveRole(entry.role, context.comparison)

        if (measure === undefined) {
          context.warn('template', 'unknownRole', widgetConfig.id, entry.role)

          return undefined
        }

        return { measure, label: entry.label, hidden: entry.hidden }
      })
      .filter((entry): entry is NamedMeasureConfig => entry !== undefined)
  }

  private static resolveRole(
    role: MeasureRole,
    comparison: Comparison | undefined,
  ): string | undefined {
    if (comparison === undefined) {
      return undefined
    }

    return role === MeasureRole.VARIATION_PCT
      ? comparison.variationPct?.key
      : comparison.variation?.key
  }

  /**
   * The exercise a name designates, whether it is a measure key or the place an
   * exercise takes in the comparison being read. `current` and `reference` let
   * a widget follow the reader instead of freezing an exercise: the balance
   * sheet drawn beside the current one is the one being compared to, N-1 or
   * N-2, and it is the same widget either way.
   *
   * A name that is neither a role nor a declared period is returned as it
   * stands — a title writes it, and a renderer reads an exercise the closing
   * does not carry, which is the same degradation as an unknown measure key.
   */
  private static resolvePeriodKey(name: string, context: BuildContext): string | undefined {
    if (name === PeriodRole.CURRENT) {
      return context.comparison?.current.key
        ?? ReportManager.resolvePeriodMeasures(context.data.metadata.measures)[0]?.key
    }

    if (name === PeriodRole.REFERENCE) {
      return context.comparison?.reference.key
    }

    return name
  }

  /**
   * Exercise a renderer reading a single one is read on: the first period the
   * measures of the widget name, falling back on the most recent closing. Taken
   * from those measures rather than from a field of its own, because a widget
   * already states which exercises it reads.
   */
  private static resolveWidgetPeriod(
    measures: NamedMeasureConfig[],
    context: BuildContext,
  ): PeriodMeasure | undefined {
    const periodMeasures = ReportManager.resolvePeriodMeasures(context.data.metadata.measures)
    const displayed = measures
      .filter(entry => entry.hidden !== true)
      .map(entry => periodMeasures.find(measure => measure.key === entry.measure))
      .find((measure): measure is PeriodMeasure => measure !== undefined)

    return displayed ?? periodMeasures[0]
  }

  /**
   * Opening balance, movements, closing balance. A line carrying the total role
   * is a balance — an absolute position drawn from zero, which restarts the
   * running total; every other line is a movement floating on it.
   *
   * Stacking the movements is geometry, not a figure: what a bar displays is the
   * value the closing ships. When the balances and the movements do not add up,
   * the last bar simply does not land on the closing balance, and the gap is
   * reported rather than absorbed.
   */
  private static buildWaterfall(
    widgetConfig: WidgetConfig,
    lines: ResolvedLine[],
    measures: NamedMeasureConfig[],
    context: BuildContext,
  ): WaterfallView | undefined {
    const period = ReportManager.resolveWidgetPeriod(measures, context)

    if (widgetConfig.display.renderer !== Renderer.WATERFALL || period === undefined) {
      return undefined
    }

    let running = 0
    const steps = lines
      .map<WaterfallStep | undefined>(line => {
        const value = ReportManager.readValue(line.indicator.id, period.key, context.data)

        if (value === undefined) {
          return undefined
        }

        const isBalance = line.role === LineRole.TOTAL
        const from = isBalance ? 0 : running
        running = isBalance ? value : running + value

        return {
          id: line.indicator.id,
          label: line.indicator.label,
          text: ReportManager.format(value, line.indicator.kind, context.data, {
            hasSign: isBalance === false,
            inThousands: context.inThousands,
          }),
          from,
          to: isBalance ? value : running,
          kind: ReportManager.resolveWaterfallStepKind(value, isBalance),
        }
      })
      .filter((step): step is WaterfallStep => step !== undefined)

    if (steps.length === 0) {
      return undefined
    }

    return {
      steps,
      locale: context.data.metadata.locale,
    }
  }

  private static resolveWaterfallStepKind(
    value: number,
    isBalance: boolean,
  ): WaterfallStepKind {
    if (isBalance) {
      return WaterfallStepKind.BALANCE
    }

    return value < 0 ? WaterfallStepKind.FALL : WaterfallStepKind.RISE
  }

  /**
   * The same lines split in two tables, by the side each one is authored on.
   * A balance sheet missing one of its halves is not a balance sheet, so the
   * renderer steps aside and leaves the widget to its table.
   */
  private static buildBalanceSheet(
    widgetConfig: WidgetConfig,
    lines: ResolvedLine[],
    measures: NamedMeasureConfig[],
    context: BuildContext,
  ): BalanceSheetView | undefined {
    if (widgetConfig.display.renderer !== Renderer.BALANCE_SHEET) {
      return undefined
    }

    const assets = ReportManager.buildTable(
      widgetConfig,
      lines.filter(line => line.side === BalanceSheetSide.ASSETS),
      measures,
      context,
    )
    const liabilities = ReportManager.buildTable(
      widgetConfig,
      lines.filter(line => line.side === BalanceSheetSide.LIABILITIES),
      measures,
      context,
    )

    return assets === undefined || liabilities === undefined
      ? undefined
      : { assets, liabilities }
  }

  /**
   * One sentence and one amount per line, grouped by the subtotals they build
   * up to. A subtotal closes its block; the lines left after the last one are
   * read as a footer — the balances a bridge ends on.
   *
   * A memo line read before the first block opens the narrative instead of
   * joining it: the starting balance is what the blocks move, never a term of
   * the first of them.
   */
  private static buildNarrative(
    widgetConfig: WidgetConfig,
    lines: ResolvedLine[],
    measures: NamedMeasureConfig[],
    context: BuildContext,
  ): NarrativeView | undefined {
    const period = ReportManager.resolveWidgetPeriod(measures, context)

    if (widgetConfig.display.renderer !== Renderer.NARRATIVE || period === undefined) {
      return undefined
    }

    const head: NarrativeLine[] = []
    const blocks: NarrativeBlock[] = []
    let current: NarrativeLine[] = []

    lines.forEach(line => {
      const narrativeLine = ReportManager.buildNarrativeLine(line, period.key, context)

      if (line.role === LineRole.MEMO && blocks.length === 0) {
        head.push(narrativeLine)

        return
      }

      if (line.role !== LineRole.SUBTOTAL) {
        current.push(narrativeLine)

        return
      }

      blocks.push({
        letter: String.fromCharCode(NARRATIVE_FIRST_LETTER_CODE + blocks.length),
        lines: current,
        total: narrativeLine,
      })
      current = []
    })

    return blocks.length === 0 ? undefined : { head, blocks, footer: current }
  }

  private static buildNarrativeLine(
    line: ResolvedLine,
    measureKey: string,
    context: BuildContext,
  ): NarrativeLine {
    return {
      id: line.indicator.id,
      label: line.indicator.label,
      value: ReportManager.format(
        ReportManager.readValue(line.indicator.id, measureKey, context.data),
        line.indicator.kind,
        context.data,
        { inThousands: context.inThousands },
      ),
    }
  }

  /**
   * Lines of a widget, in the order the template states them. A indicator the
   * closing does not describe is dropped, and so is a line carrying no value
   * on any period: an empty row says nothing.
   */
  private static resolveLines(
    widgetConfig: WidgetConfig,
    context: BuildContext,
  ): ResolvedLine[] {
    ReportManager.reportUnknownIndicators(
      widgetConfig.lines.map(line => line.indicator),
      widgetConfig.id,
      context,
    )

    return widgetConfig.lines
      .map<ResolvedLine | undefined>(templateLine => {
        const indicator = context.indicatorsById.get(templateLine.indicator)

        return indicator === undefined ? undefined : {
          indicator,
          // an unknown reference degrades to none: the card then shows the
          // effect alone rather than dropping the line altogether
          reference: templateLine.reference === undefined
            ? undefined
            : context.indicatorsById.get(templateLine.reference),
          role: templateLine.role,
          side: templateLine.side,
        }
      })
      .filter((line): line is ResolvedLine => line !== undefined)
      .filter(line => ReportManager.hasAnyValue(line.indicator.id, context.data))
  }

  /**
   * Reports the indicator ids a widget names that the closing does not describe.
   * Dropping them silently leaves the widget alive with a line or a series
   * missing: a typo on an id would be invisible, which is exactly the failure
   * the degradation is meant to make visible.
   */
  private static reportUnknownIndicators(
    indicatorIds: string[],
    widgetId: string,
    context: BuildContext,
  ): void {
    const unknownIndicatorIds = indicatorIds
      .filter(indicatorId => context.indicatorsById.has(indicatorId) === false)

    if (unknownIndicatorIds.length > 0) {
      context.warn('template', 'unknownIndicators', widgetId, unknownIndicatorIds)
    }
  }

  /**
   * Reports the columns naming a measure the closing does not declare. Such a
   * column carries no value, so it is dropped as an empty one — and a typo on a
   * measure key would be indistinguishable from an exercise the entity does not
   * have, which is exactly what has to stay visible.
   */
  private static reportUnknownMeasures(
    columns: NamedMeasureConfig[],
    widgetId: string,
    context: BuildContext,
  ): void {
    const unknownMeasures = columns
      .map(column => column.measure)
      .filter(measure => ReportManager.findMeasure(measure, context.data.metadata) === undefined)

    if (unknownMeasures.length > 0) {
      context.warn('template', 'unknownMeasures', widgetId, unknownMeasures)
    }
  }

  private static hasAnyValue(indicatorId: string, data: Dataset): boolean {
    return ReportManager.resolvePeriodMeasures(data.metadata.measures)
      .some(measure => data.values[indicatorId]?.[measure.key] !== undefined)
  }

  /** The exercises the closing carries, the most recent first. */
  static resolvePeriodMeasures(measures: Measure[]): PeriodMeasure[] {
    return measures
      .filter((measure): measure is PeriodMeasure =>
        measure.nature === MeasureNature.PERIOD)
  }

  /**
   * Readings of the closing the reader may apply, in the order their reference
   * periods are declared. Derived from the dictionary alone: a variation names
   * what it compares, so grouping the variations by their starting exercise is
   * enough to know what the closing lets the reader compare. Nothing is
   * declared, and nothing is computed.
   */
  static resolveComparisons(metadata: ClosingMetadata): Comparison[] {
    const periods = ReportManager.resolvePeriodMeasures(metadata.measures)
    const current = periods[0]

    if (current === undefined) {
      return []
    }

    // a variation that does not end on the current exercise describes a figure,
    // not a way of reading the document
    const variations = metadata.measures
      .filter((measure): measure is VariationMeasure =>
        measure.nature === MeasureNature.VARIATION && measure.to === current.key)

    return periods
      .slice(1)
      .map<Comparison | undefined>(reference => {
        const group = variations.filter(measure => measure.from === reference.key)

        return group.length === 0 ? undefined : {
          referenceKey: reference.key,
          current,
          reference,
          variation: group.find(measure => measure.kind !== ValueKind.PERCENTAGE),
          variationPct: group.find(measure => measure.kind === ValueKind.PERCENTAGE),
        }
      })
      .filter((comparison): comparison is Comparison => comparison !== undefined)
  }

  /**
   * Columns come from the template, which is shared by entities that do
   * not all close on the same periods: a column no displayed line fills is
   * dropped rather than shown as a column of blanks.
   */
  private static buildTable(
    widgetConfig: WidgetConfig,
    lines: ResolvedLine[],
    measures: NamedMeasureConfig[],
    context: BuildContext,
  ): TableView | undefined {
    if (lines.length === 0) {
      return undefined
    }

    const declaredColumns = measures
      .filter(column => column.hidden !== true)

    ReportManager.reportUnknownMeasures(declaredColumns, widgetConfig.id, context)

    const columnConfigs = declaredColumns
      .filter(column => ReportManager.isColumnFilled(column, lines, context.data))

    if (columnConfigs.length === 0) {
      return undefined
    }

    // Drops a line with no value on any shown exercise, to avoid a row of blanks
    const rows = lines
      .map<Row>(line => ({
        id: line.indicator.id,
        label: line.indicator.label,
        role: line.role,
        cells: Object.fromEntries(columnConfigs.map(column => [
          column.measure,
          ReportManager.buildCell(column, line.indicator.id, context.data, context.inThousands),
        ])),
      }))
      .filter(row => Object.values(row.cells).some(cell => cell.value !== EMPTY_VALUE))

    if (rows.length === 0) {
      return undefined
    }

    return {
      columns: columnConfigs.map(column => ({
        key: column.measure,
        ...ReportManager.buildColumnHeader(column, context.data),
        isVariation: ReportManager.isVariationColumn(column, context.data),
      })),
      rows,
    }
  }

  private static isColumnFilled(
    column: NamedMeasureConfig,
    lines: ResolvedLine[],
    data: Dataset,
  ): boolean {
    return lines
      .some(line => ReportManager.buildCell(column, line.indicator.id, data).value !== EMPTY_VALUE)
  }

  /**
   * Whether a card makes it into the widget. Hiding a card only ever touches
   * the cards: the same line keeps its row in the table, because the two are
   * two readings of the data and not two copies of a decision.
   */
  private static isCardKept(
    cardId: string,
    widgetConfig: WidgetConfig,
    context: BuildContext,
  ): boolean {
    return context.keepHidden === true || ReportManager.isCardHidden(cardId, widgetConfig) === false
  }

  private static isCardHidden(cardId: string, widgetConfig: WidgetConfig): boolean {
    return (widgetConfig.hidden?.cards ?? []).includes(cardId)
  }

  /**
   * A card reads the exercise the comparison being applied puts current,
   * against its reference. The measures come from the comparison rather than
   * from the columns of the widget: those are edited one widget at a time, and
   * hiding a column must not silently repaint every card of the report. A
   * closing with no comparison at all still shows a value, on the most recent
   * exercise of the dictionary.
   */
  private static buildCards(
    widgetConfig: WidgetConfig,
    lines: ResolvedLine[],
    context: BuildContext,
  ): Card[] {
    // the exercises come from the comparison the reader applies, never from the
    // rank of a period in the dictionary: a card and a table read the same thing
    const [firstPeriod] = ReportManager.resolvePeriodMeasures(context.data.metadata.measures)
    const current = context.comparison?.current ?? firstPeriod
    const previous = context.comparison?.reference
    // both readings of the evolution are written, the amount then the rate: one
    // says how much moved, the other how much that weighs
    const variationMeasure = context.comparison?.variation
    const variationPctMeasure = context.comparison?.variationPct

    // an effect is already a difference: it is written with its sign, coloured
    // on that sign, and carries no evolution of its own
    const isSignColored = widgetConfig.cards?.signColored === true
    // a card and the chart of the same widget are two readings of one indicator,
    // and the colour that names it in one can name it in the other — on the
    // widgets that ask for it, so that declaring a palette for a chart never
    // repaints cards nobody meant to touch
    const colorsByIndicator = widgetConfig.cards?.colored !== true
      || widgetConfig.chart === undefined
      ? new Map<string, string>()
      : ReportManager.resolveCompositionColors(widgetConfig.chart)

    return lines
      .filter(line => ReportManager.isCardKept(line.indicator.id, widgetConfig, context))
      // A card is its figure: drop a line with no value on the current exercise
      .filter(line => current !== undefined
        && ReportManager.readValue(line.indicator.id, current.key, context.data) !== undefined)
      .map<Card>((line, index) => {
        const values = context.data.values[line.indicator.id] ?? {}
        const value = current === undefined ? undefined : values[current.key]
        const previousValue = previous === undefined ? undefined : values[previous.key]
        const references = ReportManager.buildCardReferences(line, current, previous, context)
        const variationCell =
          ReportManager.buildCardVariation(line.indicator.id, variationMeasure, context)
        const variationPctCell =
          ReportManager.buildCardVariation(line.indicator.id, variationPctMeasure, context)

        return {
          id: line.indicator.id,
          title: line.indicator.label,
          value: ReportManager.format(value, line.indicator.kind, context.data, {
            hasSign: isSignColored,
            inThousands: context.inThousands,
          }),
          // the exercises of what drove the effect take the place of the ones of
          // the effect itself, which the closing does not carry
          previous: references !== undefined
            || previousValue === undefined
            || previous === undefined
            ? undefined
            : {
              label: ReportManager.buildColumnLabel({ measure: previous.key }, context.data),
              text: ReportManager.format(previousValue, line.indicator.kind, context.data, {
                inThousands: context.inThousands,
              }),
            },
          references,
          color: colorsByIndicator.get(line.indicator.id),
          variation: isSignColored ? undefined : variationCell,
          variationPct: isSignColored ? undefined : variationPctCell,
          // the two cells read the same evolution, so either one names the trend
          trend: isSignColored
            ? ReportManager.resolveTrend(value, line.indicator.sign)
            : variationCell?.trend ?? variationPctCell?.trend ?? Trend.NEUTRAL,
          isSignColored,
          isHighlighted: widgetConfig.cards?.heroFirst === true && index === 0,
          isHidden: ReportManager.isCardHidden(line.indicator.id, widgetConfig),
        }
      })
  }

  /**
   * The exercises of the comparison read on the indicator a line names as its
   * reference. Nothing is shown when the reference carries no figure on either
   * exercise: two empty rows say less than none.
   */
  private static buildCardReferences(
    line: ResolvedLine,
    current: PeriodMeasure | undefined,
    previous: PeriodMeasure | undefined,
    context: BuildContext,
  ): CardDetail[] | undefined {
    if (line.reference === undefined) {
      return undefined
    }

    const { reference } = line
    const details = [current, previous]
      .filter((period): period is PeriodMeasure => period !== undefined)
      .map(period => ({
        period,
        value: ReportManager.readValue(reference.id, period.key, context.data),
      }))
      .filter(entry => entry.value !== undefined)
      .map<CardDetail>(entry => ({
        label: i18n.global.t('keyMoments.cards.referenceValue', {
          exercise: entry.period.key,
          date: ReportManager.formatClosingMonth(entry.period.closingDate, context.data),
        }),
        text: ReportManager.format(entry.value, reference.kind, context.data, {
          inThousands: context.inThousands,
        }),
      }))

    return details.length === 0 ? undefined : details
  }

  /**
   * A card the closing gives no variation for shows none, rather than an empty
   * chip. Nothing is reconstituted from the two exercises: an absent variation
   * is an absent variation.
   */
  private static buildCardVariation(
    indicatorId: string,
    measure: Measure | undefined,
    context: BuildContext,
  ): Cell | undefined {
    if (measure === undefined) {
      return undefined
    }

    const cell = ReportManager.buildCell(
      { measure: measure.key },
      indicatorId,
      context.data,
      context.inThousands,
    )

    return cell.value === EMPTY_VALUE ? undefined : cell
  }

  private static buildChart(
    widgetConfig: WidgetConfig,
    context: BuildContext,
  ): ChartView | undefined {
    const chartConfig = widgetConfig.chart

    if (chartConfig === undefined) {
      return undefined
    }

    return chartConfig.kind === ChartKind.COMPOSITION
      ? ReportManager.buildCompositionChart(chartConfig, widgetConfig.id, context)
      : ReportManager.buildPeriodChart(chartConfig, widgetConfig.id, context)
  }

  /**
   * The exercises a chart plots, oldest first so that it is read in the same
   * direction as time. A chart naming no rank plots them all; a rank the closing
   * does not carry is simply not plotted, since the template is shared by
   * entities that do not all carry the same number of exercises.
   */
  private static resolveChartPeriods(
    chartConfig: ChartConfig,
    context: BuildContext,
  ): PeriodMeasure[] {
    const chronological = ReportManager.resolvePeriodMeasures(context.data.metadata.measures).reverse()
    const keys = chartConfig.periods

    if (keys === undefined) {
      return chronological
    }

    const plotted = new Set(keys)

    return chronological.filter(measure => plotted.has(measure.key))
  }

  /**
   * One column per plotted period. A series naming a indicator the closing does
   * not carry is dropped; the colors are read on the template, never derived
   * from the rank of a series — inserting one must not repaint the chart.
   */
  private static buildPeriodChart(
    chartConfig: ChartConfig,
    widgetId: string,
    context: BuildContext,
  ): ChartView | undefined {
    const periods = ReportManager.resolveChartPeriods(chartConfig, context)

    ReportManager.reportUnknownIndicators(
      (chartConfig.series ?? []).map(series => series.indicator),
      widgetId,
      context,
    )

    const resolved = (chartConfig.series ?? [])
      .map<ResolvedChartSeries | undefined>(config => {
        const indicator = context.indicatorsById.get(config.indicator)

        return indicator === undefined ? undefined : { config, indicator }
      })
      .filter((entry): entry is ResolvedChartSeries => entry !== undefined)
      // a series the closing never valued would be a phantom legend entry, and
      // would keep alive a widget the degradation rule drops
      .filter(entry => ReportManager.hasAnyValue(entry.indicator.id, context.data))

    if (periods.length === 0 || resolved.length === 0) {
      return undefined
    }

    const series = resolved.map<ChartSeries>(({ config, indicator }) => ({
      label: indicator.label,
      color: config.color,
      isLine: config.type === ChartSeriesType.LINE,
      points: periods.map(period => ReportManager.buildChartPoint(
        context.data.values[indicator.id]?.[period.key],
        indicator.kind,
        context,
      )),
    }))
    const lineIndex = series.findIndex(candidate => candidate.isLine)
    // an axis of amounts is graduated in thousands, which is the only unit its
    // title can announce; anything else is left to the locale to abbreviate
    const isAmountAxis = resolved
      .filter(entry => entry.config.type !== ChartSeriesType.LINE)
      .every(entry => entry.indicator.kind === ValueKind.AMOUNT)
    const primaryAxisSuffix = isAmountAxis
      ? `k${ReportManager.readCurrencySymbol(context.data)}`
      : undefined

    return {
      labels: periods.map(period => ({
        title: period.key,
        caption: ReportManager.formatClosingMonth(period.closingDate, context.data),
      })),
      series,
      isStacked: chartConfig.kind === ChartKind.STACKED_BARS,
      primaryAxisTitle: ReportManager.buildAxisTitle(
        chartConfig.primaryAxisTitle,
        primaryAxisSuffix,
      ),
      primaryAxisSuffix,
      secondaryAxis: lineIndex === -1 ? undefined : {
        color: series[lineIndex].color,
        suffix: ReportManager.resolveUnitSuffix(resolved[lineIndex].indicator.kind),
        title: chartConfig.secondaryAxisTitle,
      },
      locale: context.data.metadata.locale,
    }
  }

  /**
   * The title of an axis, followed by the unit its graduations are drawn in.
   * The template names what the axis measures and never its unit: the unit is
   * a consequence of how the figures are drawn, and the two must not be able to
   * contradict each other.
   */
  private static buildAxisTitle(
    title: string | undefined,
    suffix: string | undefined,
  ): string | undefined {
    if (title === undefined) {
      return undefined
    }

    return suffix === undefined ? title : `${title} (${suffix})`
  }

  /**
   * One column per stack, on a single period — the balance sheet read as its
   * assets against its liabilities. A stack is split into the components the
   * template declares for its aggregate: the template is the accounting truth of a
   * composition, the chart never invents its terms. Segments are plotted as
   * magnitudes, and a segment weighing nothing is not drawn.
   */
  private static buildCompositionChart(
    chartConfig: ChartConfig,
    widgetId: string,
    context: BuildContext,
  ): ChartView | undefined {
    ReportManager.reportUnknownIndicators(
      [
        ...chartConfig.stacks ?? [],
        ...(chartConfig.series ?? []).map(series => series.indicator),
      ],
      widgetId,
      context,
    )

    const period = ReportManager.resolveCompositionPeriod(chartConfig, context)

    if (period === undefined) {
      return undefined
    }

    const columns = ReportManager.resolveCompositionColumns(chartConfig, period, context)

    if (columns.length === 0) {
      return undefined
    }

    const colorsByIndicator = ReportManager.resolveCompositionColors(chartConfig)
    const drawn = columns.flatMap(column => column.segments)
    const hasUncoloredSegment = drawn
      .some(segment => colorsByIndicator.has(segment.indicator.id) === false)

    if (hasUncoloredSegment) {
      // a derived tint is readable enough to ship, but the palette belongs to
      // the template: report it so that the editing UI writes it down
      context.warn('template', 'chartWithoutColors', widgetId)
    }

    return {
      labels: columns.map(column => ({ title: column.indicator.label })),
      series: columns.flatMap<ChartSeries>((column, columnIndex) => column.segments
        .map(segment => ({
          label: segment.indicator.label,
          color: colorsByIndicator.get(segment.indicator.id)
            ?? ReportManager.deriveSegmentColor(segment.rank),
          isLine: false,
          // a segment only exists in its own column, and is a hole in the others
          points: columns.map((_column, index) => index === columnIndex
            ? ReportManager.buildChartPoint(segment.value, segment.indicator.kind, context)
            : { value: null, text: EMPTY_VALUE, compactText: EMPTY_VALUE }),
        }))),
      isStacked: true,
      legend: ReportManager.buildGroupLegend(chartConfig, drawn),
      locale: context.data.metadata.locale,
    }
  }

  /**
   * The colour each term of a composition is read under. A group names it for
   * every indicator it carries; a series still colours its own, which is what
   * a composition drawn without groups falls back on.
   */
  private static resolveCompositionColors(
    chartConfig: ChartConfig,
  ): Map<string, string> {
    return new Map([
      ...(chartConfig.series ?? []).map<[string, string]>(series => [
        series.indicator,
        series.color,
      ]),
      ...(chartConfig.groups ?? []).flatMap(group => group.indicators
        .map<[string, string]>(indicator => [indicator, group.color])),
    ])
  }

  /**
   * The groups the drawing actually shows, in the order the template states
   * them. A group no term of the closing falls into is left out: a legend is
   * read against the picture, and naming a colour absent from it is noise.
   */
  private static buildGroupLegend(
    chartConfig: ChartConfig,
    drawn: StackSegment[],
  ): ChartLegendEntry[] | undefined {
    if (chartConfig.groups === undefined) {
      return undefined
    }

    const drawnIds = new Set(drawn.map(segment => segment.indicator.id))

    return chartConfig.groups
      .filter(group => group.indicators.some(indicator => drawnIds.has(indicator)))
      .map(group => ({ label: group.label, color: group.color }))
  }

  /**
   * The balance sheet read as two surfaces rather than as an axis: each term is
   * a brick weighing its share of its own half, coloured by the aggregate it
   * feeds. Built from the composition the widget already declares — the same
   * stacks, the same terms, the same groups — so that switching between the two
   * readings never asks the template for a second description of the data.
   */
  private static buildBalanceImage(
    widgetConfig: WidgetConfig,
    context: BuildContext,
  ): BalanceImageView | undefined {
    const { chart: chartConfig, display } = widgetConfig

    if (display.renderer !== Renderer.BALANCE_IMAGE || chartConfig === undefined) {
      return undefined
    }

    const period = ReportManager.resolveCompositionPeriod(chartConfig, context)

    if (period === undefined) {
      return undefined
    }

    const columns = ReportManager.resolveCompositionColumns(chartConfig, period, context)
    const colorsByIndicator = ReportManager.resolveCompositionColors(chartConfig)

    if (columns.length === 0) {
      return undefined
    }

    return {
      columns: columns.map<BalanceImageColumn>(column => {
        // the height of a brick is its share of the aggregate as shipped, never
        // of the sum of the bricks: a column that does not add up says so by
        // not filling itself, which is the divergence the validator reports
        const total = ReportManager.readValue(column.indicator.id, period, context.data)
        // the value is displayed as the closing ships it, and only the geometry
        // is weighed as a magnitude — like the terms it divides. A half shipped
        // negative is a defect the validator reports; drawing it upside down
        // would answer it with a second one
        const height = Math.abs(total ?? 0)
        // Short label for the header, e.g. « ACTIF » rather than « TOTAL ACTIF »
        const title = column.indicator.shortLabel ?? column.indicator.label

        return {
          id: column.indicator.id,
          title,
          total: i18n.global.t('keyMoments.balanceImage.total', {
            side: title.toLocaleLowerCase(context.data.metadata.locale),
            amount: ReportManager.format(total, column.indicator.kind, context.data, {
              inThousands: context.inThousands,
            }),
          }),
          bricks: column.segments.map<BalanceImageBrick>(segment => ({
            id: segment.indicator.id,
            label: segment.indicator.label,
            text: ReportManager.format(segment.value, segment.indicator.kind, context.data, {
              inThousands: context.inThousands,
            }),
            heightPct: height === 0 ? 0 : segment.value / height * 100,
            color: colorsByIndicator.get(segment.indicator.id)
              ?? ReportManager.deriveSegmentColor(segment.rank),
          })),
        }
      }),
      legend: ReportManager.buildGroupLegend(
        chartConfig,
        columns.flatMap(column => column.segments),
      ) ?? [],
    }
  }

  /**
   * The single exercise a composition is read on, stated by the widget or, when
   * it states none, the most recent closing. A widget naming a role has nothing
   * to draw when the closing offers no comparison at all: it is dropped rather
   * than silently rebased onto another exercise.
   */
  private static resolveCompositionPeriod(
    chartConfig: ChartConfig,
    context: BuildContext,
  ): string | undefined {
    if (chartConfig.period === undefined) {
      return ReportManager.resolvePeriodMeasures(context.data.metadata.measures)[0]?.key
    }

    return ReportManager.resolvePeriodKey(chartConfig.period, context)
  }

  /**
   * A stack the closing describes nowhere is dropped, and so is a stack left
   * with nothing to draw: it would be a labelled column that is a hole in
   * every series — a visibly empty bar.
   */
  private static resolveCompositionColumns(
    chartConfig: ChartConfig,
    period: string,
    context: BuildContext,
  ): CompositionColumn[] {
    return (chartConfig.stacks ?? [])
      .map<CompositionColumn | undefined>(stack => {
        const indicator = context.indicatorsById.get(stack)

        return indicator === undefined ? undefined : {
          indicator,
          segments: ReportManager.buildStackSegments(
            indicator.components ?? [],
            period,
            context,
          ),
        }
      })
      .filter((column): column is CompositionColumn => column !== undefined)
      .filter(column => column.segments.length > 0)
  }

  /**
   * Terms of a stack, read as magnitudes on a single period: a composition
   * compares weights, and a term weighing nothing is not drawn.
   */
  private static buildStackSegments(
    components: IndicatorComponent[],
    period: string,
    context: BuildContext,
  ): StackSegment[] {
    return components
      .map(component => context.indicatorsById.get(component.indicator))
      .filter((indicator): indicator is Indicator => indicator !== undefined)
      .map(indicator => ({
        indicator,
        value: Math.abs(ReportManager.readValue(indicator.id, period, context.data) ?? 0),
      }))
      .filter(segment => segment.value > 0)
      .map((segment, rank) => ({ ...segment, rank }))
  }

  /** Kept raw for the chart, and formatted for the tooltip. */
  private static buildChartPoint(
    value: number | undefined,
    kind: ValueKind,
    context: BuildContext,
  ): ChartPoint {
    return {
      value: value ?? null,
      text: ReportManager.format(value, kind, context.data, {
        inThousands: context.inThousands,
      }),
      // written above the bar, where the full amount would not fit
      compactText: ReportManager.format(value, kind, context.data, { inThousands: true }),
    }
  }

  /**
   * Tint of a segment the template did not colorize: a neutral ramp
   * derived from the rank of the segment in its stack, meant to read as a
   * placeholder until the editing UI writes a palette.
   */
  private static deriveSegmentColor(rank: number): string {
    return `hsl(215, 25%, ${DERIVED_TINT_BASE_LIGHTNESS + rank * DERIVED_TINT_LIGHTNESS_STEP}%)`
  }

  /**
   * The measure a key designates. Keys are opaque: `N-1` is a name the closing
   * declares, never a rank the app parses. A template is shared by entities
   * that do not close on the same date, so it cites these names rather than
   * dates — and an export is free to ship one the app has never heard of.
   */
  static findMeasure(key: string, metadata: ClosingMetadata): Measure | undefined {
    return metadata.measures.find(measure => measure.key === key)
  }

  /**
   * Whether a column reads a variation. Read from the nature the closing
   * declares rather than from the role the template asked for: a column named
   * by its measure key carries no role, and both must colour the same way.
   */
  static isVariationColumn(column: NamedMeasureConfig, data: Dataset): boolean {
    const measure = ReportManager.findMeasure(column.measure, data.metadata)

    return measure?.nature === MeasureNature.VARIATION
  }

  /**
   * Header a column displays, in two lines. Derived from the measure rather
   * than carried by it: a label is translated, and the closing has no business
   * choosing the language of its reader.
   *
   * The title names what the column is in the vocabulary of the export — the
   * exercise as the closing keys it, or what the variation reads — and the
   * caption dates it. A label the template states replaces both: naming a
   * column itself is naming it whole.
   */
  static buildColumnHeader(
    column: NamedMeasureConfig,
    data: Dataset,
  ): ColumnHeader {
    if (column.label !== undefined) {
      return { title: column.label }
    }

    const measure = ReportManager.findMeasure(column.measure, data.metadata)

    if (measure === undefined) {
      return { title: column.measure }
    }

    if (measure.nature === MeasureNature.PERIOD) {
      return {
        title: measure.key,
        caption: ReportManager.formatClosingMonth(measure.closingDate, data),
      }
    }

    if (measure.nature === MeasureNature.RATIO) {
      const indicator = ReportManager.findIndicator(measure.of, data)

      return {
        title: i18n.global.t('keyMoments.columns.ratio', {
          indicator: indicator?.shortLabel ?? indicator?.label ?? measure.of,
        }),
        caption: ReportManager.formatPeriod(measure.period, data),
      }
    }

    // a variation names what it compares: the exercises displayed are the same
    // in every comparison, so the header is the only thing that tells them apart
    const isPercentage = measure.kind === ValueKind.PERCENTAGE
    const exercises = { from: measure.from, to: measure.to }

    return isPercentage
      ? {
        title: i18n.global.t('keyMoments.columns.deltaPct'),
        caption: i18n.global.t('keyMoments.columns.deltaPctCaption', exercises),
      }
      : {
        title: i18n.global.t('keyMoments.columns.delta', exercises),
        caption: i18n.global.t('keyMoments.columns.deltaCaption', {
          from: ReportManager.formatPeriod(measure.from, data),
          to: ReportManager.formatPeriod(measure.to, data),
        }),
      }
  }

  /**
   * The same header on one line, for the places that have no second one — the
   * footer of a card, where the column is named beside a figure.
   */
  static buildColumnLabel(column: NamedMeasureConfig, data: Dataset): string {
    const { title, caption } = ReportManager.buildColumnHeader(column, data)

    return caption === undefined ? title : `${title} (${caption})`
  }

  /**
   * A title naming an exercise dates it on the closing being read: the author
   * writes `Bilan N ({N}) en image`, the placeholder is filled with the closing
   * month of `N`. The sentence belongs to the template and the date to the
   * data — neither is in a position to write the other's half.
   *
   * An exercise the widget does not choose cannot be spelled out in the
   * sentence either: `Bilan {reference:key} ({reference}) en image` reads
   * « Bilan N-2 (12/2023) en image » once the reader compares to N-2.
   *
   * A key the closing does not declare as a period is written as it stands,
   * exactly as a column header names a measure it cannot resolve.
   *
   * A role the comparison cannot fill is the one case with no honest wording
   * left: a closing shipping a single exercise resolves `{reference}` to
   * nothing, and writing the role name would title a block « Bilan reference »
   * over the figures of the current exercise. The title is then absent, and the
   * widget is dropped — the same degradation its renderer already applies.
   */
  private static resolveTitle(title: string, context: BuildContext): string | undefined {
    let hasUnresolvedRole = false

    const resolved = title.replaceAll(
      TITLE_PERIOD_PLACEHOLDER,
      (_placeholder, name: string, written?: string) => {
        const key = ReportManager.resolvePeriodKey(name, context)

        if (key === undefined) {
          hasUnresolvedRole = true

          return name
        }

        return written === 'key' ? key : ReportManager.formatPeriod(key, context.data)
      },
    )

    return hasUnresolvedRole ? undefined : resolved
  }

  private static formatPeriod(key: string, data: Dataset): string {
    const measure = ReportManager.findMeasure(key, data.metadata)

    return measure === undefined || measure.nature !== MeasureNature.PERIOD
      ? key
      : ReportManager.formatClosingMonth(measure.closingDate, data)
  }

  /**
   * A closing month, which is what a column header dates itself on: the day is
   * carried by the caption under the title of the page, and repeating it six
   * times across a header only costs width.
   */
  private static formatClosingMonth(closingDate: string, data: Dataset): string {
    return formatCalendarMonthYear(closingDate, data.metadata.locale)
  }

  private static findIndicator(indicatorId: string, data: Dataset): Indicator | undefined {
    return data.indicators.find(indicator => indicator.id === indicatorId)
  }

  private static readValue(
    indicatorId: string,
    measureKey: string,
    data: Dataset,
  ): number | undefined {
    return data.values[indicatorId]?.[measureKey]
  }

  /**
   * What a column displays for a indicator. Nothing is computed here: every
   * figure, variation and ratio included, is read from the closing. A measure
   * the export did not ship leaves the cell empty — it is never reconstituted
   * from the exercises, because a rounding the producer applied is part of what
   * it published.
   */
  static buildCell(
    column: NamedMeasureConfig,
    indicatorId: string,
    data: Dataset,
    inThousands = false,
  ): Cell {
    const indicator = ReportManager.findIndicator(indicatorId, data)
    const measure = ReportManager.findMeasure(column.measure, data.metadata)

    if (indicator === undefined || measure === undefined) {
      return { value: EMPTY_VALUE, trend: Trend.NEUTRAL }
    }

    const value = ReportManager.readValue(indicatorId, measure.key, data)
    const isVariation = measure.nature === MeasureNature.VARIATION

    return {
      value: ReportManager.format(
        value,
        ReportManager.resolveMeasureKind(measure, indicator),
        data,
        { hasSign: isVariation, inThousands },
      ),
      trend: isVariation
        ? ReportManager.resolveTrend(value, indicator.sign)
        : Trend.NEUTRAL,
    }
  }

  /**
   * Unit a measure is displayed in. The closing states it when it is its own —
   * a rate of change is a percentage whatever it measures. Otherwise the
   * measure borrows the unit of the indicator, with the only unit rule the app
   * keeps: a difference between two rates is read in points, not in percent.
   */
  private static resolveMeasureKind(
    measure: Measure,
    indicator: Indicator,
  ): ValueKind {
    if (measure.kind !== undefined) {
      return measure.kind
    }

    if (measure.nature === MeasureNature.RATIO) {
      return ValueKind.PERCENTAGE
    }

    return measure.nature === MeasureNature.VARIATION
      && indicator.kind === ValueKind.PERCENTAGE
      ? ValueKind.POINTS
      : indicator.kind
  }

  static resolveTrend(value: number | undefined, sign: IndicatorSign): Trend {
    if (value === undefined || value === 0) {
      return Trend.NEUTRAL
    }

    const isFavorable = value > 0 === (sign === IndicatorSign.INCOME)

    return isFavorable ? Trend.POSITIVE : Trend.NEGATIVE
  }

  /**
   * Formats a value according to its kind, using the currency and the locale
   * carried by the closing metadata.
   */
  static format(
    value: number | undefined,
    kind: ValueKind,
    data: Dataset,
    { hasSign = false, inThousands = false }: FormatOptions = {},
  ): string {
    if (value === undefined) {
      return EMPTY_VALUE
    }

    const { locale, currency } = data.metadata
    const signDisplay = hasSign ? 'exceptZero' : 'auto'

    if (kind === ValueKind.AMOUNT) {
      if (inThousands === true) {
        return ReportManager.formatInThousands(value, data, signDisplay)
      }

      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
        signDisplay,
      }).format(value)
    }

    const formattedValue = new Intl.NumberFormat(locale, { maximumFractionDigits: 1, signDisplay })
      .format(value)

    return `${formattedValue} ${ReportManager.resolveUnitSuffix(kind)}`.trim()
  }

  /**
   * An amount read in thousands. `Intl` has no such notation, so the amount is
   * divided and the currency symbol is read from the locale rather than written
   * down: a closing in another currency must not print a hard-coded euro.
   */
  private static formatInThousands(
    value: number,
    data: Dataset,
    signDisplay: 'auto' | 'exceptZero',
  ): string {
    const thousands = value / THOUSAND
    // Forced to 0: `Intl` would otherwise keep the sign of `-0.4` and print `-0 k€`
    const amount = new Intl.NumberFormat(data.metadata.locale, {
      maximumFractionDigits: 0,
      signDisplay,
    }).format(Math.abs(thousands) < 0.5 ? 0 : thousands)

    return `${amount}${NO_BREAK_SPACE}k${ReportManager.readCurrencySymbol(data)}`
  }

  /**
   * The symbol the locale writes the currency of the closing with. Read rather
   * than written down: a closing in another currency must not print a
   * hard-coded euro.
   */
  private static readCurrencySymbol(data: Dataset): string {
    const { locale, currency } = data.metadata

    return new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find(part => part.type === 'currency')?.value ?? currency
  }

  private static resolveUnitSuffix(kind: ValueKind): string {
    if (kind === ValueKind.PERCENTAGE) {
      return i18n.global.t('keyMoments.units.percentage')
    }

    if (kind === ValueKind.DAYS) {
      return i18n.global.t('keyMoments.units.days')
    }

    if (kind === ValueKind.POINTS) {
      return i18n.global.t('keyMoments.units.points')
    }

    // a headcount carries its unit in its label — « Effectif en équivalent temps
    // plein (ETP) » — rather than on each of its four figures, where « ETP »
    // repeated says nothing the line has not already said
    return ''
  }
}
