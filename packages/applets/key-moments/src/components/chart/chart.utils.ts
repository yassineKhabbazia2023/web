import { AppColors } from '@pulse/styleguide'
import { isLightColor } from '../../utils/color.utils'
import type { ChartDataset, Element, TooltipItem } from 'chart.js'
import type { ChartView } from '../../types/key-moments.types'

const THOUSAND = 1000

/** Widest a bar is allowed to get, so two columns never merge into a band */
const MAX_BAR_THICKNESS = 96

const BAR_VALUE_INSET = 10
const BAR_VALUE_LIGHT = AppColors.WHITE
const BAR_VALUE_DARK = AppColors.BLACK_ROCK_900

/** Room a segment must leave for its amount, or it is left bare */
const MIN_BAR_HEIGHT_FOR_VALUE = 26
const BAR_VALUE_PADDING = 12

/** What a bar element resolves to once drawn; `getProps` types them as unknown */
interface BarGeometry {
  x: number
  y: number
  /** Where the bar starts: the baseline, or the top of the segment below it */
  base: number
  width: number
}

export function buildDatasets(chart: ChartView): ChartDataset[] {
  return chart.series.map(series => series.isLine
    ? {
      type: 'line',
      label: series.label,
      data: series.points.map(point => point.value),
      borderColor: series.color,
      borderWidth: 3,
      pointBackgroundColor: AppColors.WHITE,
      pointBorderColor: series.color,
      pointBorderWidth: 3,
      pointRadius: 5,
      yAxisID: 'secondary',
      // lines stay legible by being drawn on top of the bars
      order: 0,
    }
    : {
      type: 'bar',
      label: series.label,
      data: series.points.map(point => point.value),
      backgroundColor: series.color,
      borderColor: AppColors.WHITE,
      borderWidth: chart.isStacked ? 1 : 0,
      maxBarThickness: MAX_BAR_THICKNESS,
      // wide bars: a column is a block, not a stick
      categoryPercentage: 0.7,
      barPercentage: 0.98,
      yAxisID: 'primary',
      order: 1,
    })
}

/**
 * Whichever of the two inks the module writes on that bar. The rule is the one
 * the balance image already follows: only a pale fill carries dark ink, and
 * every other step of the palette — the navy, the jungle green — is written on
 * in white.
 *
 * A colour the canvas cannot read leaves the text light, which is what the
 * charts are drawn in.
 */
export function pickReadableInk(
  ctx: CanvasRenderingContext2D,
  color: string | undefined,
): string {
  if (color === undefined) {
    return BAR_VALUE_LIGHT
  }

  // whatever notation the template came in, the canvas normalises it to
  // `#rrggbb` on the way, which is the one form the measurement reads
  ctx.fillStyle = color

  return isLightColor(ctx.fillStyle) ? BAR_VALUE_DARK : BAR_VALUE_LIGHT
}

/**
 * Sits the amount inside the top of its own segment. A stacked segment is
 * measured between its two ends rather than from the baseline: only its own
 * height says whether the text fits in it.
 */
export function drawBarValue(ctx: CanvasRenderingContext2D, bar: Element, text: string): void {
  const { x, y, base, width } = bar.getProps(['x', 'y', 'base', 'width'], true) as BarGeometry
  const height = Math.abs(base - y)
  const isFitting = height >= MIN_BAR_HEIGHT_FOR_VALUE
    && width >= ctx.measureText(text).width + BAR_VALUE_PADDING

  if (isFitting === false) {
    return
  }

  // a bar grown downwards writes its amount under its own top edge, not above it
  const isUpwards = y <= base

  ctx.textBaseline = isUpwards ? 'top' : 'bottom'
  ctx.fillText(text, x, isUpwards ? y + BAR_VALUE_INSET : y - BAR_VALUE_INSET)
}

/**
 * An exercise over the month it closes on. Chart.js reads an array of strings
 * as the lines of one tick, which is what puts the date under its exercise.
 */
export function buildTickLabels(chart: ChartView): (string | string[])[] {
  return chart.labels
    .map(label => label.caption === undefined ? label.title : [label.title, label.caption])
}

export function formatTick(chart: ChartView, value: number | string, suffix = ''): string {
  const abbreviated = new Intl.NumberFormat(chart.locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value))

  return `${abbreviated} ${suffix}`.trim()
}

/**
 * Graduates the left axis in the unit its title announces. An axis of amounts
 * is read in thousands — `2 400 k€` — and anything else is left to the locale
 * to abbreviate, a rate and a headcount having no such notation.
 */
export function formatPrimaryTick(chart: ChartView, value: number | string): string {
  const { primaryAxisSuffix, locale } = chart

  if (primaryAxisSuffix === undefined) {
    return formatTick(chart, value)
  }

  const amount = Number(value) / THOUSAND
  // Below 5: one decimal, or rounded steps would read `0, 1, 1, 2`
  const thousands = new Intl.NumberFormat(locale, {
    maximumFractionDigits: amount !== 0 && Math.abs(amount) < 5 ? 1 : 0,
  }).format(amount)

  return `${thousands} ${primaryAxisSuffix}`
}

/** Tooltips show the value already formatted by the manager. */
export function formatTooltip(chart: ChartView, item: TooltipItem<'bar' | 'line'>): string {
  const point = chart.series[item.datasetIndex]?.points[item.dataIndex]

  return `${item.dataset.label} : ${point?.text ?? ''}`
}
