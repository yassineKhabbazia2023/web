import { AppColors } from '@pulse/styleguide'
import {
  ColorToken,
  LineRole,
  Trend,
  WaterfallStepKind,
} from '../enums/key-moments.enums'
import type { CSSProperties } from 'vue'

/** Shown for a missing value, kept empty so it's never mistaken for a zero amount. */
export const EMPTY_VALUE = ''

/** Default grid span of a widget, out of 12. */
export const DEFAULT_WIDGET_SPAN = 12

/** The version a template is authored on, before any is appended. */
export const FIRST_TEMPLATE_VERSION = '1.0.0'

/** Model laid out — in its most recent version — until the reader picks another one. */
export const DEFAULT_TEMPLATE_CODE = 'engagement'

/**
 * Recommendations an exercice may carry, the hidden ones included: the cap
 * bounds what is stored, and the microservice refuses a twenty-first with a
 * 400. Never written on screen — nobody attaches twenty offers to a balance
 * sheet, and a counter would answer a question no reader is asking.
 */
export const OFFERS_CAP = 20

/** Bounds of the width slider: every column count the 12-column grid allows. */
export const MIN_WIDGET_SPAN = 1
export const MAX_WIDGET_SPAN = 12

/** Text color applied to a value depending on how its variation reads. */
export const TREND_TEXT_COLOR_CLASS: Record<Trend, string> = {
  [Trend.POSITIVE]: 'text-color--text-success',
  [Trend.NEGATIVE]: 'text-color--text-error',
  [Trend.NEUTRAL]: 'text-color--text-body',
}

/** Modifier tinting the top border and the variation chip of a card. */
export const TREND_CARD_MODIFIER: Record<Trend, string> = {
  [Trend.POSITIVE]: 'key-moments-cards__card--positive',
  [Trend.NEGATIVE]: 'key-moments-cards__card--negative',
  [Trend.NEUTRAL]: 'key-moments-cards__card--neutral',
}

/**
 * How long a chart waits before redrawing itself after a resize. Folding the
 * navigation narrows the report over a quarter of a second, and a chart served
 * every frame of that movement redraws fifteen times to show the same figures.
 * Short enough to stay unnoticed when a chart is simply scrolled into view.
 */
export const CHART_RESIZE_DELAY = 100

/**
 * The whole palette a template may paint a chart with, and the only place it is
 * written: a template names a token, this record says which ramp step of the
 * styleguide that token stands for. Recoloring the module — a series slot, or
 * the balance sheet — is editing a line here, and every chart, legend and
 * PowerPoint export follows. Nothing is authored: every step comes from
 * `AppColors`, so a rebranding repaints the reports along with the rest.
 *
 * The three balance aggregates own their steps rather than reusing the series
 * slots, whose navy and green are the application's own and read as chrome
 * rather than as data. They are taken far enough apart from the jungle green,
 * and from one another, to stay told apart by a color-blind reader.
 */
export const KEY_MOMENTS_COLOR: Record<ColorToken, string> = {
  [ColorToken.SERIES_PRIMARY]: AppColors.BLACK_ROCK_900,
  [ColorToken.SERIES_ACCENT]: AppColors.JUNGLE_400,
  [ColorToken.SERIES_MUTED]: AppColors.GRAY_500,
  [ColorToken.SERIES_SOFT]: AppColors.MINT_TULIP_500,
  [ColorToken.BALANCE_WORKING_CAPITAL]: AppColors.TEAL_500,
  [ColorToken.BALANCE_WORKING_CAPITAL_NEED]: AppColors.TRANQUIL_600,
  [ColorToken.BALANCE_CASH]: AppColors.TEAL_800,
}

/**
 * Fill of a waterfall bar. Semantic rather than authored: a rise and a fall
 * must read like the trends of the tables, so the palette is not left to the
 * template — an author repainting them would break that agreement.
 */
export const WATERFALL_STEP_COLOR: Record<WaterfallStepKind, string> = {
  [WaterfallStepKind.BALANCE]: AppColors.BLACK_ROCK_900,
  [WaterfallStepKind.RISE]: AppColors.JUNGLE_400,
  // no ramp step carries this red: the text error is too dark to fill a bar
  [WaterfallStepKind.FALL]: '#D13D3D',
}

/**
 * Background of a table line carrying an emphasis role. Element-plus only
 * exposes the cell, hence an inline style rather than a row class.
 */
export const ROLE_CELL_STYLE: Partial<Record<LineRole, CSSProperties>> = {
  [LineRole.SUBTOTAL]: {
    backgroundColor: 'var(--key-moments-emphasis-surface)',
  },
  [LineRole.TOTAL]: {
    backgroundColor: 'var(--key-moments-emphasis-surface)',
    borderTop: '2px solid var(--p-text-heading)',
  },
}

/**
 * What separates two statements of the caption stating what a report is —
 * `RYDGE · Clôture au 31/12/2025 · Engagement`. Read as a list of statements
 * rather than as one sentence, and the same one on both surfaces. The deck the
 * export writes carries the same parts, one per line.
 */
export const CAPTION_SEPARATOR = ' · '
