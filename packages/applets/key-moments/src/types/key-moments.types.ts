import type {
  BalanceSheetSide,
  ChartKind,
  ChartSeriesType,
  CurrencyDisplay,
  DivergenceFamily,
  DivergenceKind,
  IndicatorSign,
  LineRole,
  MeasureNature,
  MeasureRole,
  Renderer,
  Trend,
  ValueKind,
  WaterfallStepKind,
} from '../enums/key-moments.enums'
import type { CatalogOfferPayload } from '../services/offers.service.types'
import type { ExerciceRecommendationsPayload } from '../services/recommendations.service.types'
import type { PublishedRecommendationPayload } from './recommendations.types'

/* ------------------------------------------------------------------ *
 * Indicators — the accounting vocabulary. A indicator is declared once,
 * whatever the number of sections reading it.
 * ------------------------------------------------------------------ */

/** One term of an aggregate, always added to it. */
export interface IndicatorComponent {
  indicator: string
}

export interface Indicator {
  id: string
  label: string
  /**
   * Same indicator where width is scarce — the header of a ratio column, which
   * names it inside a few dozen pixels. Falls back on the label, so declaring
   * one is only worth it for the indicators a full label would not fit.
   */
  shortLabel?: string
  /** What the indicator means, offered beside its name; null when the firm wrote none */
  description?: string | null
  kind: ValueKind
  /** Drives the reading of a delta, never the way values are stored */
  sign: IndicatorSign
  /**
   * Terms this aggregate combines, the accounting truth of a composition. Says
   * nothing about where its own value comes from — that stays the closing.
   * A total is an indicator like any other, so it is declared here rather than
   * on the line of a template that happens to display it.
   */
  components?: IndicatorComponent[]
  /**
   * Retired from the vocabulary without being erased: the templates already
   * citing it keep reading it. Set by the vocabulary editor only — the report
   * never reads it.
   */
  isDeprecated?: boolean
}

export interface Indicators {
  /** Absent from the served document: only the shipped files carry one */
  version?: string
  indicators: Indicator[]
}

/* ------------------------------------------------------------------ *
 * Template — one authored document per vertical: which indicator is read
 * by which widget, in which order, and how the whole report is laid out.
 * ------------------------------------------------------------------ */

export interface TemplateLine {
  indicator: string
  /**
   * Indicator this line is an effect of. Read by the cards renderer only, which
   * shows the exercises of the comparison on it: an effect is a figure without
   * a history of its own, and only means something beside what drove it.
   */
  reference?: string
  role?: LineRole
  /**
   * Side the line sits on, read by the balance sheet renderer only. Authored
   * rather than deduced from the aggregates: a balance sheet lists its assets
   * in more detail than the totals combine them.
   */
  side?: BalanceSheetSide
}

/* ------------------------------------------------------------------ *
 * Closing — what a closing produces for one entity.
 * ------------------------------------------------------------------ */

/**
 * A figure the closing carries, named by a key the template cites. The key is
 * opaque: `N-1` is a name the dictionary resolves, never a rank the app parses,
 * which is what lets an export ship a measure the app has never heard of.
 */
interface MeasureBase {
  key: string
  /**
   * Unit of the measure. Absent means it is the one of the indicator read —
   * with the only unit rule the app keeps, a difference of two rates being
   * read in points.
   */
  kind?: ValueKind
}

/** Identified by its closing date: a period says something out of context. */
export interface PeriodMeasure extends MeasureBase {
  nature: MeasureNature.PERIOD
  closingDate: string
}

/**
 * `from` and `to` describe what the export compared, so that the measure can be
 * labelled and its value checked. They are never replayed to produce it: a
 * variation the closing does not carry stays absent.
 */
export interface VariationMeasure extends MeasureBase {
  nature: MeasureNature.VARIATION
  from: string
  to: string
}

/** Descriptive too: `of` and `period` name the quotient, they do not divide. */
export interface RatioMeasure extends MeasureBase {
  nature: MeasureNature.RATIO
  of: string
  period: string
}

export type Measure =
  | PeriodMeasure
  | VariationMeasure
  | RatioMeasure

export interface ClosingEntity {
  name: string
  legalForm: string
  siret: string
}

export interface Exercice {
  startDate: string
  endDate: string
}

export interface ClosingMetadata {
  schemaVersion: string
  generatedAt: string
  generator: string
  entity: ClosingEntity
  currency: string
  locale: string
  /** Published exercice; with `entity.siret`, it identifies the key moment */
  exercice: Exercice
  /** Period measures ordered, the most recent first */
  measures: Measure[]
}

export interface Closing {
  metadata: ClosingMetadata
  /**
   * Indicator id -> measure key -> value. A missing key means "not provided",
   * never a zero, and never something to reconstitute. A indicator absent from
   * the vocabulary, or a measure absent from the dictionary, is dropped on
   * assembly.
   */
  values: Record<string, Record<string, number>>
  /** Editorial slots with free ids; a widget attaches one, or none */
  comments: Record<string, string>
}

/**
 * A reading of the closing: the current exercise against an earlier one, and
 * the measures the closing ships to compare them. Derived from the dictionary
 * rather than declared, so that an export shipping a variation against a third
 * exercise offers a third reading without a template being touched.
 */
export interface Comparison {
  /** Key of the reference period, which identifies the comparison */
  referenceKey: string
  current: PeriodMeasure
  reference: PeriodMeasure
  /** Absolute variation, absent when the closing ships only a relative one */
  variation?: VariationMeasure
  variationPct?: VariationMeasure
}

/* ------------------------------------------------------------------ *
 * Dataset — the vocabulary and the closing merged, the figures a report
 * is built on. The template is not part of it: it lays those figures out,
 * and swapping it never asks the data for anything.
 * ------------------------------------------------------------------ */

export interface Dataset {
  metadata: ClosingMetadata
  indicators: Indicator[]
  /** Indicator id -> measure key -> value. A missing key means "not provided" */
  values: Record<string, Record<string, number>>
  comments: Record<string, string>
}

/* ------------------------------------------------------------------ *
 * Layout — the rest of the template document: everything that is not a
 * data id. Authored, meant to be edited and served apart.
 * ------------------------------------------------------------------ */

interface MeasureConfigBase {
  /** Overrides the label derived from the measure */
  label?: string
  /**
   * Kept out of the report without losing its settings. Hiding never deletes:
   * the editor has to be able to bring an element back exactly as it was.
   */
  hidden?: boolean
}

/** Names the measure read, whatever the comparison applied. Never switches. */
export interface NamedMeasureConfig extends MeasureConfigBase {
  /** Key of the measure read, resolved against the dictionary of the closing */
  measure: string
}

/**
 * Names the place instead of the measure, so that the same document reads the
 * current exercise against whichever earlier one the reader picked.
 */
export interface RoleMeasureConfig extends MeasureConfigBase {
  role: MeasureRole
}

/**
 * One measure of the closing the widget reads. It carries no shape of its own:
 * what the figure means is declared once, by the dictionary of the closing, so
 * shipping a new kind of measure never asks the app to learn a fourth column.
 *
 * Named after what it reads rather than after the table that displays it: the
 * measures of a widget are the other axis of its data, the one `lines` crosses.
 * A renderer reading a single exercise takes the first of them.
 */
export type MeasureConfig =
  | NamedMeasureConfig
  | RoleMeasureConfig

export interface ChartSeriesConfig {
  indicator: string
  /**
   * Color carried by the series itself, never derived from its position:
   * reordering a series must not repaint the chart. A template names a token of
   * `KEY_MOMENTS_COLOR`, resolved once by the validation, so the palette is
   * edited in one record; any other CSS color is honoured as written.
   */
  color: string
  type?: ChartSeriesType
}

/**
 * A colour of a composition, and what that colour is called. Several indicators
 * share one: the colour of a brick says which aggregate the line feeds — its
 * fonds de roulement, son besoin en fonds de roulement, sa trésorerie — never
 * what the line is. An indicator belongs to at most one group.
 */
export interface ChartGroupConfig {
  label: string
  color: string
  indicators: string[]
}

export interface ChartConfig {
  kind: ChartKind
  /** Period charts: one series per indicator, spread over the exercises */
  series?: ChartSeriesConfig[]
  /**
   * Compositions: the colours the terms are read under, each one named. Takes
   * precedence over the colour a series carries, and is what the legend lists.
   */
  groups?: ChartGroupConfig[]
  /**
   * Written above the left axis, which the bars are measured on. The unit the
   * axis is drawn in is appended by the presentation, never authored here.
   */
  primaryAxisTitle?: string
  /** Written above the right axis, in the colour of the line it measures */
  secondaryAxisTitle?: string
  /**
   * Period charts: the keys of the period measures plotted. Absent means every
   * exercise the closing carries, which is what a chart says unless told
   * otherwise. Measure keys rather than dates, like everywhere in this document.
   */
  periods?: string[]
  /**
   * Composition charts: the single exercise the columns are read on, named
   * either by its measure key or by the place it takes in the comparison the
   * reader applies (`current`, `reference` — see `PeriodRole`).
   */
  period?: string
  /** Composition charts: the aggregates to compare, split by their components */
  stacks?: string[]
}

/** How a widget presents itself, whatever the data it ends up carrying. */
export interface WidgetDisplay {
  /**
   * `{<exercice>}` writes its closing month and `{<exercice>:key}` its key; an
   * exercise is named as it is anywhere else, by its measure key or by its
   * place in the comparison the reader applies.
   */
  title: string
  /** Representation applied by default; the reader may switch to another */
  renderer: Renderer
  span?: number
}

/** Settings of the cards, absent when there is nothing to set. */
export interface CardsConfig {
  /** Renders the first card as a hero */
  heroFirst?: boolean
  /**
   * Writes the value of every card with its sign and colours the card on it,
   * instead of reading a variation the widget does not carry. What an effect
   * widget needs: the figure it displays is already a difference.
   */
  signColored?: boolean
  /**
   * Tints the top border of a card with the colour its indicator is drawn in by
   * the chart of the same widget, instead of with its trend. A choice of the
   * author, never a consequence of the widget happening to declare a palette:
   * naming an indicator by its colour is what an aggregate needs, and it costs
   * the trend the border would otherwise carry.
   */
  colored?: boolean
}

/**
 * What the editor keeps out of the report without losing it. Hiding never
 * deletes, so every flag here is written as `true` or left out entirely — an
 * absent flag already reads as visible, and writing `false` back would litter
 * the exported document.
 */
export interface WidgetHidden {
  widget?: true
  /** Leaves the editorial slot out, without forgetting which one it was */
  comment?: true
  /**
   * Indicator ids of the cards left out. Only ever affects the cards: the same
   * line stays in the table.
   */
  cards?: string[]
}

/**
 * A widget reads a matrix — `lines` by `measures` — and every renderer it
 * declares is one projection of it. Hence the shape of this document: what is
 * read, how it is displayed, what each renderer sets, and what is hidden. A
 * renderer with nothing to set declares no block at all, which is why there is
 * no `table` here: once the measures are read at this level, a table has no
 * setting of its own.
 */
export interface WidgetConfig {
  id: string
  /** Indicators this widget reads, in reading order */
  lines: TemplateLine[]
  /** Measures this widget reads; defaults to `defaultMeasures` */
  measures?: MeasureConfig[]
  /** Id of an editorial slot of the closing; missing means no comment */
  comment?: string
  display: WidgetDisplay
  cards?: CardsConfig
  chart?: ChartConfig
  hidden?: WidgetHidden
}

export interface ScreenConfig {
  id: string
  title: string
  /** Overline announcing what the section is about, above its title */
  subtitle?: string
  widgets: WidgetConfig[]
  /** Kept out of the report without losing its settings */
  hidden?: boolean
}

export interface Template {
  version: string
  id: string
  label: string
  /** Measures read by every widget that declares none of its own */
  defaultMeasures: MeasureConfig[]
  screens: ScreenConfig[]
}

/**
 * `templateId` addresses the resource; `id` is the one the document carries,
 * and the only one the page and the editor ever know.
 */
export interface TemplateSummary {
  templateId: number
  id: string
  version: string
  label: string
}

/**
 * A model is what a `code` names across its versions: the reader picks one,
 * then which version of it is laid out.
 */
export interface TemplateModel {
  code: string
  label: string
}

/** An exercice exists before it carries figures, hence the nullable closing. */
export interface ExerciceSummary {
  exerciceId: number
  exerciceStartDate: string
  exerciceEndDate: string
  closingId: number | null
  version: number | null
  generatedAt: string | null
}

/** Re-importing never overwrites: it adds a version, the highest being the last. */
export interface ClosingSummary {
  closingId: number
  version: number
  generatedAt: string
  importedAt: string
  importedBy: string
}

/* ------------------------------------------------------------------ *
 * View model — what the components consume. Unchanged by design.
 * ------------------------------------------------------------------ */

/**
 * Header of a column, in two lines: what the column is, then what it is dated
 * on. Split rather than written on one line because a table carries up to six
 * of them, and the exercises are what the reader scans across.
 */
export interface ColumnHeader {
  /** The exercise, or what the variation reads — `N`, `N-1`, `Var. N/N-1`, `%` */
  title: string
  /** Dates the title, and absent when the template names the column itself */
  caption?: string
}

export interface Column extends ColumnHeader {
  key: string
  /**
   * Whether the column reads a variation. Only the header uses it: a variation
   * is set apart by its own colour, so that a figure and its evolution are
   * never confused at a glance.
   */
  isVariation: boolean
}

export interface Cell {
  value: string
  trend: Trend
}

export interface Row {
  id: string
  label: string
  /** Definition of the indicator the line reads, absent when none was written */
  description?: string
  role?: LineRole
  cells: Record<string, Cell>
}

export interface CardDetail {
  label: string
  text: string
}

export interface Card {
  id: string
  title: string
  /** Definition of the indicator the card reads, absent when none was written */
  description?: string
  value?: string
  /** Same indicator on the previous period, shown in the card footer */
  previous?: CardDetail
  /** Amount and percentage of the same evolution (`+154 453 € · +8,2 %`); either may be absent. */
  variation?: Cell
  variationPct?: Cell
  /**
   * The exercises of the comparison read on the indicator this line names as
   * its reference — what an effect is an effect of. Replaces the previous
   * period and the chip: an effect has no evolution of its own to show.
   */
  references?: CardDetail[]
  /**
   * Colour the indicator is drawn in by the chart of the same widget, which the
   * card carries so that the two readings name the same thing the same way.
   * Absent when the widget declares no colour for it.
   */
  color?: string
  /**
   * How the card reads as a whole, which tints its chip and, failing a colour
   * of its own, its top border. Comes from the variation it carries, or from
   * the sign of its own value when the widget is configured to colour by sign.
   */
  trend: Trend
  /**
   * Whether the trend describes the value itself rather than a variation beside
   * it. The value is then written with its sign and tinted, since it is the
   * only figure of the card the colour can be about.
   */
  isSignColored: boolean
  isHighlighted: boolean
  /** Only ever true when the report was built keeping the hidden elements */
  isHidden: boolean
}

export interface TableView {
  columns: Column[]
  rows: Row[]
}

/** A plotted value, kept raw for the chart and formatted for the tooltip. */
export interface ChartPoint {
  value: number | null
  text: string
  /**
   * Same value read in thousands, which is what fits above a bar. Amounts only:
   * every other unit is already short, and reads identically.
   */
  compactText: string
}

/**
 * One column of a chart: the exercise it plots over the month it closes on, or
 * the name of a composition stack, which dates itself on nothing.
 */
export interface ChartLabel {
  title: string
  caption?: string
}

export interface ChartSeries {
  label: string
  color: string
  /** Drawn as a line against the secondary axis rather than as a bar */
  isLine: boolean
  /** One point per label of the chart */
  points: ChartPoint[]
}

/** Right-hand axis, present only when a series is plotted as a line. */
export interface ChartSecondaryAxis {
  /** Color of the line it measures, so that the axis reads as its own */
  color: string
  /** Unit appended to the ticks, empty when the values carry none */
  suffix: string
  /** Written above the axis, in its own colour; absent when unauthored */
  title?: string
}

/**
 * One colour of the chart, and what it is called. A composition names its
 * groups here rather than its series: several bars share a colour, and it is
 * the colour that the reader has to be able to name.
 */
export interface ChartLegendEntry {
  label: string
  color: string
}

export interface ChartView {
  /** One entry per column: an exercise, or the name of a composition stack */
  labels: ChartLabel[]
  series: ChartSeries[]
  isStacked: boolean
  /** Title of the left axis, unit included; absent when unauthored */
  primaryAxisTitle?: string
  /**
   * Unit the graduations of the left axis are drawn in — `k€` on an axis of
   * amounts, which is what the title announces. Absent leaves them abbreviated
   * by the locale, which is what an axis of rates or of headcounts needs.
   */
  primaryAxisSuffix?: string
  secondaryAxis?: ChartSecondaryAxis
  /**
   * Replaces the one entry per series the chart would list by itself. Present
   * only on a composition, where a series is a term and never a colour.
   */
  legend?: ChartLegendEntry[]
  /** Carried by the export, and needed to abbreviate the axis ticks */
  locale: string
}

/**
 * One term of a balance sheet read as a surface. `heightPct` is a geometry —
 * the share the term takes of its own column — and never a figure: what is
 * written on the brick is `text`, the amount as the closing ships it.
 */
export interface BalanceImageBrick {
  id: string
  label: string
  text: string
  heightPct: number
  color: string
}

/** One half of the balance sheet, drawn as a column of bricks under its total. */
export interface BalanceImageColumn {
  id: string
  title: string
  /** The aggregate as the closing ships it, never the sum of the bricks */
  total: string
  bricks: BalanceImageBrick[]
}

/**
 * The balance sheet read as two surfaces of equal area, each term coloured by
 * the aggregate it feeds. A reading of the same data the composition chart
 * draws, without an axis: the eye compares the blocks, not the graduations.
 */
export interface BalanceImageView {
  columns: BalanceImageColumn[]
  legend: ChartLegendEntry[]
}

/**
 * The two halves of a balance sheet, each laid out as a table of its own so
 * that the columns of the widget apply to both.
 */
export interface BalanceSheetView {
  assets: TableView
  liabilities: TableView
}

/**
 * One step of a waterfall. `from` and `to` are the ends of the bar on the axis,
 * derived by stacking the movements on the running balance — geometry, not a
 * figure: what is written above the bar is `text`, the value as shipped.
 */
export interface WaterfallStep {
  id: string
  label: string
  text: string
  from: number
  to: number
  kind: WaterfallStepKind
}

export interface WaterfallView {
  steps: WaterfallStep[]
  locale: string
}

/**
 * A line of a narrative: a sentence and an amount. A line closing its block
 * carries the subtotal role, which is what ends the block.
 */
export interface NarrativeLine {
  id: string
  label: string
  value: string
}

/**
 * A block of a narrative, ended by the line that sums it up. `letter` is its
 * rank read as A, B, C… — the reading order is the whole point of the layout.
 */
export interface NarrativeBlock {
  letter: string
  lines: NarrativeLine[]
  /** The line closing the block; absent when the block never got its subtotal */
  total?: NarrativeLine
}

export interface NarrativeView {
  /** Lines opening the narrative, read before any block: the starting balance */
  head: NarrativeLine[]
  blocks: NarrativeBlock[]
  /** Lines standing outside any block, read after them: the final balances */
  footer: NarrativeLine[]
}

/**
 * A widget carries every representation its data supports, so that switching
 * renderer is a display toggle and never a reload.
 */
export interface Widget {
  id: string
  title: string
  comment: string
  /**
   * Editorial slot this widget reads, which the encart writes its contribution
   * to. Absent when the template attaches none — the encart is then not shown.
   */
  commentSlotId?: string
  span: number
  /** Renderer currently applied, initialised from the presentation config */
  renderer: Renderer
  /** Renderers this widget can be switched to, in display order */
  availableRenderers: Renderer[]
  table?: TableView
  cards?: Card[]
  chart?: ChartView
  waterfall?: WaterfallView
  balanceSheet?: BalanceSheetView
  balanceImage?: BalanceImageView
  narrative?: NarrativeView
  /** Only ever true when the report was built keeping the hidden elements */
  isHidden: boolean
  /** The editorial slot is not displayed, whatever it carries */
  isCommentHidden: boolean
}

/** Callback for the `save` event: reports whether the text was taken so the encart can close. */
export type SaveSettlement = (isSaved: boolean) => void

/**
 * One reading of an editorial slot as the encart displays it: identity already
 * resolved, so that the component never knows what a contributor id is.
 *
 * A variant is a person or a closing version — never merely "delivered": an
 * exercice re-imported carries one delivered text per version, and `key` is
 * what tells two of them apart.
 */
export interface CommentVariant {
  /** Identifies the variant among the tabs of its slot */
  key: string
  /** `null` on a text a closing delivered */
  contributorId: string | null
  /** Set on a delivered variant only */
  closingVersion?: number
  /** Full name of the contributor, or the version the closing delivered */
  label: string
  /**
   * What the tab of the variant is read by: a person by their initials, two
   * letters at most, a closing by the version it delivered — it has no name to
   * abbreviate, and a tab drawn from its initials would be blank.
   *
   * Stated here rather than chosen in the template: what a tab says is a
   * reading of the variant, and a rule left in markup goes away with it.
   */
  tabLabel: string
  text: string
  updatedAt?: string
  isMine: boolean
}

/**
 * Everything the encart of one widget needs, assembled by the comments
 * composable: which slot
 * it writes to, the readings it offers, and the one the client would read.
 */
export interface CommentBoard {
  slotId: string
  variants: CommentVariant[]
  /** Key of the variant the firm retained; empty while it falls back on the default */
  retainedKey: string
  /**
   * Key of the reading that would be published — the retained one when the firm
   * arbitrated, the fallback the microservice applies when it did not. Empty
   * when the slot would go out with nothing.
   */
  publishableKey: string
  /**
   * Whether the firm took the slot out of the publication. Distinct from an
   * empty `publishableKey`, which is what a slot no reading fills looks like:
   * this one was decided, and the encart says so rather than showing nothing.
   */
  isDiscarded: boolean
  /**
   * The tab my writing opens on before anything is saved. Absent when no user
   * is loaded, which is also when nothing may be written.
   */
  draftVariant?: CommentVariant
}

export interface Screen {
  id: string
  title: string
  /** Overline of the section, absent when the template names none */
  subtitle?: string
  widgets: Widget[]
  /** Only ever true when the report was built keeping the hidden elements */
  isHidden: boolean
}

export interface Report {
  entity: ClosingEntity
  screens: Screen[]
}

/**
 * What a publication freezes besides the comments: which layout, which figures
 * and under which reading the report was arbitrated. Every field is something
 * the page already displays.
 */
export interface PublishContext {
  templateId: number
  templateVersion: string
  closingId: number
  closingVersion: number
  /** Measure key of the reference exercise; absent on a closing with no comparison (a first exercice) */
  preferenceComparisonExercice?: string
  preferenceCurrencyDisplay: CurrencyDisplay
}

/**
 * Everything a publication settles, in one shape read on both sides: what the
 * page would publish, and what the active publication holds. The symmetry is
 * what lets the two be compared field by field without either side knowing
 * where the other came from.
 */
export interface PublishableState {
  templateId: number
  /** Resolved by the caller from the catalogue, so a diff can name it */
  templateName: string
  /** Code of the model the template belongs to; absent if the catalogue no longer carries it. */
  templateCode?: string
  templateVersion: string
  closingId: number
  /** Resolved by the caller from the catalogue, as the selector names it */
  closingName: string
  closingVersion: number
  preferenceComparisonExercice?: string
  preferenceCurrencyDisplay: string
  /**
   * Slot id -> text, as it would be published.
   *
   * The two sides describe different sets on purpose. The current side names
   * **every slot the report on screen cites**, empty when nothing would go out
   * for it; the published side names only what the publication froze, which
   * the microservice fills by its own rule and never by the template. The
   * comparison reads the current side's slots, and reads an absent text and an
   * empty one as one and the same.
   */
  comments: Record<string, string>
  /**
   * Sub-sections left out. Never sent at publication — the microservice freezes
   * what the firm had decided — but read back on the detail, so that hiding one
   * and not publishing afterwards is a divergence the page can name.
   */
  hiddenWidgets: string[]
  /**
   * What publishing would freeze of the recommendations: the visible ones, in
   * order, flat. A projection rather than the working copy, because the
   * published side reads `PublicationDetail.recommendations`, which carries
   * the visible ones only.
   */
  recommendations: PublishedRecommendationPayload[]
}

/**
 * One reason the report on screen differs from what the client reads. Carries
 * no translated text: the comparison states what differs, the page words it.
 */
export interface Divergence {
  kind: DivergenceKind
  family: DivergenceFamily
  /** Interpolation values the label consumes: `from`, `to`, `count`, … */
  values?: Record<string, string | number>
}

/**
 * The reading choices of the editor, shared by the firm and persisted without
 * publishing anything. Each field is null until somebody chose it, and a `PUT`
 * replaces the object entire — an absent choice erases the stored one.
 *
 * Same names and values as the `POST /publish` payload on purpose: a
 * preference is the same statement, made before the publication freezes it.
 */
export interface EditorPreferences {
  /** Numeric id of the gabarit, resolved against the catalogue */
  templateId: number | null
  /** Measure key of the reference exercise, as everywhere else in the module */
  preferenceComparisonExercice: string | null
  preferenceCurrencyDisplay: CurrencyDisplay | null
}

/**
 * Everything the editor reads when opening an exercice, before choosing a
 * closing, served in one call. The lists are empty and the preferences null
 * when nothing was ever saved — never a 404.
 */
export interface ExerciceDraft {
  preferences: EditorPreferences
  hiddenWidgetIds: string[]
  closings: ClosingSummary[]
  /** The recommendations of the exercice, read with the rest and written on their own route */
  recommendations: ExerciceRecommendationsPayload
}

/** The published preferences an exercice reopens on. */
export interface PublishedPreferences {
  /** Numeric id the publication carries, resolved against the catalogue */
  templateId: number
  /** Absent when the publication compared against nothing */
  referenceKey?: string
  isInThousands: boolean
}

/**
 * Something the build could not read, as the manager words it.
 *
 * `subject` is what it reproaches: `template` names an authoring mistake — an
 * indicator nobody declares, a measure no column can fill — where `figures`
 * names the closing itself. Only the first is worth showing to whoever is
 * authoring a template on figures that are not a real closing.
 */
export type ReportWarningCode =
  | 'unknownRole'
  | 'rendererUnavailable'
  | 'unknownIndicators'
  | 'unknownMeasures'
  | 'chartWithoutColors'

export interface ReportWarning {
  subject: 'template' | 'figures'
  code: ReportWarningCode
  details: unknown[]
}

export interface BuildOptions {
  /**
   * The collaborator surface needs to display what it lets the firm bring back,
   * so it builds the report keeping the hidden elements and renders them as
   * such. Reading the report never does.
   */
  keepHidden?: boolean
  /**
   * Keeps a screen left without any widget. What the editor asks for, for the
   * same reason it keeps the hidden ones: a section it does not show is a
   * section its author cannot fill.
   */
  keepEmptyScreens?: boolean
  /**
   * Reads every amount in thousands. A display choice that applies to the whole
   * page, so it is settled once at build time rather than by each component.
   */
  inThousands?: boolean
  /**
   * Comparison the whole report is read on, named by the key of its reference
   * period. Absent reads the first one the closing offers, and so does a key it
   * does not offer: a report is never emptied by a stale choice.
   */
  referenceKey?: string
  /**
   * Takes over what the build has to report — an unknown indicator, a measure
   * the closing does not carry. Given one, the manager stops writing to the
   * logger: the caller has taken responsibility for showing them, and the
   * editor rebuilds the report on every keystroke.
   */
  onWarning?: (warning: ReportWarning) => void
}

/* ------------------------------------------------------------------ *
 * Filter bar — the reading choices the page offers above the report.
 * ------------------------------------------------------------------ */

/**
 * A reading choice is either named by a key the data or the catalogue carries,
 * or is the display unit, which nothing but the reader decides.
 *
 * Widened to what `PSegmentedControl` reads, which displays these choices: the
 * two would otherwise differ by a case no filter uses, and every handler would
 * carry a cast to say so.
 */
export type FilterValue = string | number | boolean

export interface FilterOption {
  value: FilterValue
  label: string
}

/* ------------------------------------------------------------------ *
 * The offers catalogue, as the recommendations pick from it.
 * ------------------------------------------------------------------ */

/**
 * A catalogue offer and the single string it is searched on, indexed once when
 * the catalogue lands rather than on every keystroke.
 */
export interface SearchableOffer extends CatalogOfferPayload {
  searchTerms: string
}
