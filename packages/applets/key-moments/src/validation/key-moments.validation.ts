import { logger } from '@pulse/toolbox'
import {
  KEY_MOMENTS_COLOR,
  MAX_WIDGET_SPAN,
  MIN_WIDGET_SPAN,
} from '../const/key-moments.consts'
import {
  BalanceSheetSide,
  ChartKind,
  ChartSeriesType,
  ColorToken,
  LineRole,
  MeasureRole,
  Renderer,
} from '../enums/key-moments.enums'
import type {
  TemplateWarning,
  TemplateWarningCode,
  ValidateTemplateOptions,
} from './key-moments.validation.types'
import type {
  MeasureConfig,
  ScreenConfig,
  Template,
  TemplateLine,
  WidgetConfig,
  WidgetDisplay,
  WidgetHidden,
} from '../types/key-moments.types'

const EMPTY_TEMPLATE: Template = {
  version: '0.0.0',
  id: '',
  label: '',
  defaultMeasures: [],
  screens: [],
}

/**
 * A template that says nothing, rebuilt on every call rather than handed out as
 * the constant itself: a page writes onto the template it holds, and a shared
 * empty one would be written onto for the whole session.
 *
 * What a surface renders while it holds no document. Holding none is a state,
 * not a document that failed to read — which is why it goes through here rather
 * than through `validateTemplate`, whose job is to report what it could not read.
 */
export function emptyTemplate(): Template {
  return { ...EMPTY_TEMPLATE, defaultMeasures: [], screens: [] }
}

type RawRecord = Record<string, unknown>

/** How every reader of this file reports what it had to leave out. */
type Warn = (code: TemplateWarningCode, detail: unknown) => void

/** How the logger words each warning. What an author reads is translated. */
const WARNING_MESSAGES: Record<TemplateWarningCode, string> = {
  documentUnreadable: '[KeyMoments] template: document is not an object',
  measureDropped: '[KeyMoments] template: unreadable measure dropped',
  lineDropped: '[KeyMoments] template: unreadable line dropped',
  widgetDropped: '[KeyMoments] template: unreadable widget dropped',
  screenDropped: '[KeyMoments] template: unreadable screen dropped',
  emptyScreenKept: '[KeyMoments] template: screen without any widget, not rendered',
}

function isRecord(value: unknown): value is RawRecord {
  return typeof value === 'object' && value !== null && Array.isArray(value) === false
}

function readString(record: RawRecord, key: string): string | undefined {
  const value = record[key]

  return typeof value === 'string' && value !== '' ? value : undefined
}

function isEnumValue<T extends Record<string, string>>(candidate: unknown, values: T): boolean {
  return typeof candidate === 'string' && Object.values<string>(values).includes(candidate)
}

/**
 * The ink a chart is painted with, read here once so nothing downstream ever
 * meets a token. A template names a slot of `KEY_MOMENTS_COLOR`, which is where
 * the palette is edited; a raw CSS color is still honoured, for the one-off a
 * token would only obscure.
 */
function readColor(candidate: unknown): string | undefined {
  if (typeof candidate !== 'string' || candidate === '') {
    return undefined
  }

  return isEnumValue(candidate, ColorToken)
    ? KEY_MOMENTS_COLOR[candidate as ColorToken]
    : candidate
}

/** Only ever `true` or absent — `false` is never written back, since absent already means visible. */
function readHidden(record: RawRecord): true | undefined {
  return record.hidden === true ? true : undefined
}

/** An absent or emptied list is left out, so the exported document stays terse. */
function readStringList(raw: unknown): string[] | undefined {
  if (Array.isArray(raw) === false) {
    return undefined
  }

  const entries = raw.filter((entry): entry is string => typeof entry === 'string')

  return entries.length === 0 ? undefined : entries
}

/**
 * A measure entry names either the measure it reads, or the role it plays in
 * the comparison the reader applies — never both, and never neither. What the
 * measure means is declared by the closing, so nothing about its shape is
 * validated here. A key the closing does not declare is not a reason to drop
 * the entry: the report drops it as an empty column, and says so.
 */
function validateMeasure(raw: unknown): MeasureConfig | undefined {
  if (isRecord(raw) === false) {
    return undefined
  }

  const label = readString(raw, 'label')
  const hidden = readHidden(raw)
  const measure = readString(raw, 'measure')
  const role = readRole(raw)

  if (measure !== undefined && role !== undefined) {
    return undefined
  }

  if (role !== undefined) {
    return { role, label, hidden }
  }

  return measure === undefined ? undefined : { measure, label, hidden }
}

/** An unknown role reads as no role, which drops the entry and reports it. */
function readRole(raw: RawRecord): MeasureRole | undefined {
  const role = readString(raw, 'role')
  const roles: string[] = Object.values(MeasureRole)

  return role !== undefined && roles.includes(role)
    ? role as MeasureRole
    : undefined
}

function validateMeasures(raw: unknown, warn: Warn): MeasureConfig[] | undefined {
  if (Array.isArray(raw) === false) {
    return undefined
  }

  return raw
    .map(entry => {
      const measure = validateMeasure(entry)

      if (measure === undefined) {
        warn('measureDropped', entry)
      }

      return measure
    })
    .filter((measure): measure is MeasureConfig => measure !== undefined)
}

function validateLine(raw: unknown): TemplateLine | undefined {
  if (isRecord(raw) === false) {
    return undefined
  }

  const indicator = readString(raw, 'indicator')

  if (indicator === undefined) {
    return undefined
  }

  return {
    indicator,
    // a reference the vocabulary does not declare is dropped by the build, not
    // here: the template is validated without any knowledge of the vocabulary
    reference: readString(raw, 'reference'),
    role: isEnumValue(raw.role, LineRole) ? raw.role as LineRole : undefined,
    side: isEnumValue(raw.side, BalanceSheetSide)
      ? raw.side as BalanceSheetSide
      : undefined,
  }
}

function validateLines(raw: unknown, warn: Warn): TemplateLine[] {
  return (Array.isArray(raw) ? raw : [])
    .map(entry => {
      const line = validateLine(entry)

      if (line === undefined) {
        warn('lineDropped', entry)
      }

      return line
    })
    .filter((line): line is TemplateLine => line !== undefined)
}

function validateChart(raw: unknown): WidgetConfig['chart'] {
  if (isRecord(raw) === false || isEnumValue(raw.kind, ChartKind) === false) {
    return undefined
  }

  const series = Array.isArray(raw.series)
    ? raw.series
      .filter(isRecord)
      .filter(entry => typeof entry.indicator === 'string' && readColor(entry.color) !== undefined)
      .map(entry => ({
        indicator: entry.indicator as string,
        color: readColor(entry.color) as string,
        type: isEnumValue(entry.type, ChartSeriesType)
          ? entry.type as ChartSeriesType
          : undefined,
      }))
    : undefined
  const stacks = Array.isArray(raw.stacks)
    ? raw.stacks.filter((stack): stack is string => typeof stack === 'string')
    : undefined
  const groups = Array.isArray(raw.groups)
    ? raw.groups
      .filter(isRecord)
      .filter(entry => typeof entry.label === 'string' && readColor(entry.color) !== undefined)
      .map(entry => ({
        label: entry.label as string,
        color: readColor(entry.color) as string,
        indicators: readStringList(entry.indicators) ?? [],
      }))
    : undefined

  return {
    kind: raw.kind as ChartKind,
    series,
    groups,
    periods: readStringList(raw.periods),
    period: readString(raw, 'period'),
    stacks,
    primaryAxisTitle: readString(raw, 'primaryAxisTitle'),
    secondaryAxisTitle: readString(raw, 'secondaryAxisTitle'),
  }
}

/**
 * A widget with no readable title or no renderer to apply has nothing to
 * display, hence no display block to build: it is the widget that gets dropped.
 */
function validateDisplay(raw: unknown): WidgetDisplay | undefined {
  if (isRecord(raw) === false) {
    return undefined
  }

  const title = readString(raw, 'title')

  if (title === undefined || isEnumValue(raw.renderer, Renderer) === false) {
    return undefined
  }

  return {
    title,
    renderer: raw.renderer as Renderer,
    // bounded like everything else the document states: the grid counts twelve
    // columns, and a span outside that describes no width at all — zero divides
    // the widths of a slide by nothing when the export lays its row out
    span: typeof raw.span === 'number' ? readSpan(raw.span) : undefined,
  }
}

function readSpan(span: number): number {
  return Math.min(Math.max(Math.round(span), MIN_WIDGET_SPAN), MAX_WIDGET_SPAN)
}

/** Holds only raised flags, and is dropped entirely when none is — absent means visible. */
function validateWidgetHidden(raw: unknown): WidgetHidden | undefined {
  if (isRecord(raw) === false) {
    return undefined
  }

  const hidden: WidgetHidden = {
    widget: raw.widget === true ? true : undefined,
    comment: raw.comment === true ? true : undefined,
    cards: readStringList(raw.cards),
  }

  return Object.values(hidden).every(flag => flag === undefined) ? undefined : hidden
}

/**
 * Both flags are written as `true` or left out: a card block stating nothing is
 * no card block at all.
 */
function validateCards(raw: unknown): WidgetConfig['cards'] {
  if (isRecord(raw) === false) {
    return undefined
  }

  const cards = {
    heroFirst: raw.heroFirst === true ? true : undefined,
    signColored: raw.signColored === true ? true : undefined,
    colored: raw.colored === true ? true : undefined,
  }

  return Object.values(cards).every(flag => flag === undefined) ? undefined : cards
}

function validateWidget(raw: unknown, warn: Warn): WidgetConfig | undefined {
  if (isRecord(raw) === false) {
    return undefined
  }

  const id = readString(raw, 'id')
  const display = validateDisplay(raw.display)
  const lines = validateLines(raw.lines, warn)

  if (id === undefined || display === undefined || lines.length === 0) {
    return undefined
  }

  return {
    id,
    lines,
    measures: validateMeasures(raw.measures, warn),
    comment: readString(raw, 'comment'),
    display,
    cards: validateCards(raw.cards),
    chart: validateChart(raw.chart),
    hidden: validateWidgetHidden(raw.hidden),
  }
}

/**
 * `noteEmptyScreen` is the permission to keep a screen carrying no readable
 * widget: given, the screen survives and is merely noted; absent, it is
 * dropped — a section with nothing to show is nothing to render.
 */
function validateScreen(raw: unknown, warn: Warn, noteEmptyScreen?: Warn): ScreenConfig | undefined {
  if (isRecord(raw) === false) {
    return undefined
  }

  const id = readString(raw, 'id')
  const title = readString(raw, 'title')
  const widgets = (Array.isArray(raw.widgets) ? raw.widgets : [])
    .map(entry => {
      const widget = validateWidget(entry, warn)

      if (widget === undefined) {
        warn('widgetDropped', entry)
      }

      return widget
    })
    .filter((widget): widget is WidgetConfig => widget !== undefined)

  if (id === undefined || title === undefined) {
    return undefined
  }

  if (widgets.length === 0) {
    if (noteEmptyScreen === undefined) {
      return undefined
    }

    noteEmptyScreen('emptyScreenKept', raw)
  }

  return {
    id,
    title,
    // an overline the template does not state leaves the section titled alone
    subtitle: readString(raw, 'subtitle'),
    widgets,
    hidden: readHidden(raw),
  }
}

/**
 * Reads a template document defensively. It is authored outside the app and
 * served apart, so anything unreadable is dropped and reported rather than
 * trusted — a malformed widget must never take the page down.
 *
 * Rebuilds the document rather than walking it: two reads of the same source
 * never share a mutable object, which is what lets the page write onto one
 * while another is put back.
 *
 * `options.onWarning` observes what was dropped, for the editor to show rather
 * than to log silently. Passing none changes nothing.
 */
export function validateTemplate(raw: unknown, options: ValidateTemplateOptions = {}): Template {
  const report = (severity: TemplateWarning['severity']): Warn => (code, detail) => {
    // given a collector, the caller shows the warnings: the editor validates on
    // every edit, and a console filling up says nothing to an author
    if (options.onWarning === undefined) {
      logger.warn(WARNING_MESSAGES[code], detail)

      return
    }

    options.onWarning({ severity, code, detail } satisfies TemplateWarning)
  }

  const warn = report('dropped')
  /** What is said without blocking: nothing is lost, the rendering only differs */
  const note = report('unknown')

  if (isRecord(raw) === false) {
    warn('documentUnreadable', raw)

    return emptyTemplate()
  }

  return {
    version: readString(raw, 'version') ?? EMPTY_TEMPLATE.version,
    id: readString(raw, 'id') ?? EMPTY_TEMPLATE.id,
    label: readString(raw, 'label') ?? EMPTY_TEMPLATE.label,
    defaultMeasures: validateMeasures(raw.defaultMeasures, warn) ?? [],
    screens: (Array.isArray(raw.screens) ? raw.screens : [])
      .map(entry => {
        const screen = validateScreen(entry, warn, options.keepEmptyScreens === true ? note : undefined)

        if (screen === undefined) {
          warn('screenDropped', entry)
        }

        return screen
      })
      .filter((screen): screen is ScreenConfig => screen !== undefined),
  }
}
