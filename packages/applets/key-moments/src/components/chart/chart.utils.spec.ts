import { AppColors } from '@pulse/styleguide'
import {
  buildDatasets,
  buildTickLabels,
  drawBarValue,
  formatPrimaryTick,
  formatTick,
  formatTooltip,
  pickReadableInk,
} from './chart.utils'
import type { Element, TooltipItem } from 'chart.js'
import type { ChartView } from '../../types/key-moments.types'

/** A bar of amounts and a line of rates, one column with a caption and one bare. */
const CHART: ChartView = {
  labels: [
    { title: 'N (12/2025)', caption: '31/12/2025' },
    { title: 'N-1 (12/2024)' },
  ],
  series: [
    {
      label: "Chiffre d'affaires",
      color: '#123456',
      isLine: false,
      points: [
        { value: 2400000, text: '2 400 000 €', compactText: '2 400 k€' },
        { value: null, text: '', compactText: '' },
      ],
    },
    {
      label: 'Marge',
      color: '#654321',
      isLine: true,
      points: [
        { value: 42, text: '42 %', compactText: '42 %' },
        { value: 40, text: '40 %', compactText: '40 %' },
      ],
    },
  ],
  isStacked: false,
  primaryAxisSuffix: 'k€',
  locale: 'fr-FR',
}

describe('buildDatasets', () => {

  it('should plot a series as a bar on the primary axis, under the lines', () => {
    const [bar] = buildDatasets(CHART)

    expect(bar).toMatchObject({
      type: 'bar',
      label: "Chiffre d'affaires",
      data: [2400000, null],
      backgroundColor: '#123456',
      yAxisID: 'primary',
      order: 1,
    })
  })

  it('should plot a line series against the secondary axis, drawn on top', () => {
    const [, line] = buildDatasets(CHART)

    expect(line).toMatchObject({
      type: 'line',
      label: 'Marge',
      data: [42, 40],
      borderColor: '#654321',
      yAxisID: 'secondary',
      order: 0,
    })
  })
})

describe('buildTickLabels', () => {

  it('should put the caption of a column under its title, and leave a bare one alone', () => {
    expect(buildTickLabels(CHART)).toEqual([
      ['N (12/2025)', '31/12/2025'],
      'N-1 (12/2024)',
    ])
  })
})

describe('formatting the graduations', () => {

  it('should graduate an axis of amounts in the unit its title announces', () => {
    expect(formatPrimaryTick(CHART, 400000)).toBe('400 k€')
  })

  /** Graduated under a thousand, the steps of an axis would all round to the same figure. */
  it('should keep a decimal on an axis of small amounts', () => {
    expect(formatPrimaryTick(CHART, 1500)).toBe('1,5 k€')
    expect(formatPrimaryTick(CHART, 0)).toBe('0 k€')
    expect(formatPrimaryTick(CHART, 12000)).toBe('12 k€')
  })

  it('should leave any other axis to the locale, suffix trimmed away', () => {
    expect(formatPrimaryTick({ ...CHART, primaryAxisSuffix: undefined }, 42)).toBe('42')
    expect(formatTick(CHART, 42, '%')).toBe('42 %')
  })

  it('should tooltip the text the manager already formatted', () => {
    const item = {
      datasetIndex: 0,
      dataIndex: 0,
      dataset: { label: "Chiffre d'affaires" },
    } as TooltipItem<'bar' | 'line'>

    expect(formatTooltip(CHART, item)).toBe("Chiffre d'affaires : 2 400 000 €")
  })
})

describe('pickReadableInk', () => {

  const ctx = { fillStyle: '' } as CanvasRenderingContext2D

  it('should write dark on a pale bar and light on a dark one', () => {
    expect(pickReadableInk(ctx, '#ffffff')).toBe(AppColors.BLACK_ROCK_900)
    expect(pickReadableInk(ctx, '#000000')).toBe(AppColors.WHITE)
  })

  it('should write light on the jungle green of the series', () => {
    expect(pickReadableInk(ctx, AppColors.JUNGLE_400)).toBe(AppColors.WHITE)
  })

  it('should stay light when the bar has no colour to read', () => {
    expect(pickReadableInk(ctx, undefined)).toBe(AppColors.WHITE)
  })
})

describe('drawBarValue', () => {

  function buildContext(): CanvasRenderingContext2D {
    return {
      measureText: vi.fn(() => ({ width: 30 })),
      fillText: vi.fn(),
      textBaseline: '',
    } as unknown as CanvasRenderingContext2D
  }

  function buildBar(geometry: Record<string, number>): Element {
    return { getProps: () => geometry } as unknown as Element
  }

  it('should sit the amount inside the top of its own segment', () => {
    const ctx = buildContext()

    drawBarValue(ctx, buildBar({ x: 50, y: 20, base: 80, width: 60 }), '2 400 k€')

    expect(ctx.textBaseline).toBe('top')
    expect(vi.mocked(ctx.fillText)).toHaveBeenCalledWith('2 400 k€', 50, 30)
  })

  it('should write under the top edge of a bar grown downwards', () => {
    const ctx = buildContext()

    drawBarValue(ctx, buildBar({ x: 50, y: 80, base: 20, width: 60 }), '-400 k€')

    expect(ctx.textBaseline).toBe('bottom')
    expect(vi.mocked(ctx.fillText)).toHaveBeenCalledWith('-400 k€', 50, 70)
  })

  it('should leave a segment bare when its amount cannot fit', () => {
    const tooNarrow = buildContext()
    drawBarValue(tooNarrow, buildBar({ x: 50, y: 20, base: 80, width: 20 }), '2 400 k€')

    const tooShort = buildContext()
    drawBarValue(tooShort, buildBar({ x: 50, y: 60, base: 80, width: 60 }), '2 400 k€')

    expect(vi.mocked(tooNarrow.fillText)).not.toHaveBeenCalled()
    expect(vi.mocked(tooShort.fillText)).not.toHaveBeenCalled()
  })
})
