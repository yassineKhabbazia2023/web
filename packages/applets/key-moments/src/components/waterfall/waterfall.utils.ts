import type { TooltipItem } from 'chart.js'
import type { WaterfallView } from '../../types/key-moments.types'

// Floating bars: a point is the pair of bounds of a step, not a single value
export function buildStepBounds(waterfall: WaterfallView): [number, number][] {
  return waterfall.steps.map(step => [step.from, step.to])
}

export function formatTick(waterfall: WaterfallView, value: number | string): string {
  return new Intl.NumberFormat(waterfall.locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value))
}

export function formatTooltip(waterfall: WaterfallView, item: TooltipItem<'bar'>): string {
  return `${item.label} : ${waterfall.steps[item.dataIndex]?.text ?? ''}`
}
