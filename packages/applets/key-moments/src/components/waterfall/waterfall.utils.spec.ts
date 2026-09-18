import { WaterfallStepKind } from '../../enums/key-moments.enums'
import { buildStepBounds, formatTick, formatTooltip } from './waterfall.utils'
import type { TooltipItem } from 'chart.js'
import type { WaterfallView } from '../../types/key-moments.types'

/** An opening balance, a rise, a fall, and the closing balance they lead to. */
const WATERFALL: WaterfallView = {
  locale: 'fr-FR',
  steps: [
    { id: 'opening', label: 'Ouverture', text: '1 000 €', from: 0, to: 1000, kind: WaterfallStepKind.BALANCE },
    { id: 'income', label: 'Encaissements', text: '+500 €', from: 1000, to: 1500, kind: WaterfallStepKind.RISE },
    { id: 'expenses', label: 'Décaissements', text: '-300 €', from: 1500, to: 1200, kind: WaterfallStepKind.FALL },
    { id: 'closing', label: 'Clôture', text: '1 200 €', from: 0, to: 1200, kind: WaterfallStepKind.BALANCE },
  ],
}

function normalizeSpaces(text: string): string {
  return text.replaceAll(/\s/g, ' ')
}

describe('waterfall utils', () => {
  it('should give every step its pair of bounds, in reading order', () => {
    expect(buildStepBounds(WATERFALL)).toEqual([[0, 1000], [1000, 1500], [1500, 1200], [0, 1200]])
  })

  it('should give no bounds without any step', () => {
    expect(buildStepBounds({ ...WATERFALL, steps: [] })).toEqual([])
  })

  it('should write the ticks compact, in the locale of the report', () => {
    expect(normalizeSpaces(formatTick(WATERFALL, 1250000))).toBe('1,3 M')
    expect(formatTick({ ...WATERFALL, locale: 'en-US' }, 1250000)).toBe('1.3M')
  })

  it('should read a tick chart.js hands over as a string', () => {
    expect(formatTick({ ...WATERFALL, locale: 'en-US' }, '2500')).toBe('2.5K')
  })

  it('should tooltip the label and the text already formatted of the step', () => {
    const item = { label: 'Décaissements', dataIndex: 2 } as TooltipItem<'bar'>

    expect(formatTooltip(WATERFALL, item)).toBe('Décaissements : -300 €')
  })

  it('should tooltip the label alone when the step is missing', () => {
    const item = { label: 'Inconnu', dataIndex: 9 } as TooltipItem<'bar'>

    expect(formatTooltip(WATERFALL, item)).toBe('Inconnu : ')
  })
})
