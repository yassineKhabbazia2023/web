import { bodyRows, headerRow } from './export.render'
import {
  EMPHASIS_FILL,
  MEMO_COLOR,
  SLIDE_HEADING_COLOR,
  TABLE_HEADER_FILL,
  TABLE_VARIATION_FILL,
  TREND_COLOR,
} from './export.consts'
import { EMPTY_VALUE } from '../const/key-moments.consts'
import { LineRole, Trend } from '../enums/key-moments.enums'
import type { DeckLabels } from './export.types'
import type { TableView } from '../types/key-moments.types'

const LABELS = { lineLabel: 'Indicateurs' } as DeckLabels

/** One plain exercise column, one dated variation column. */
const VIEW: TableView = {
  columns: [
    { key: 'N', title: 'N (12/2025)', isVariation: false },
    { key: 'variation.N-1', title: 'Évolution', caption: 'vs N-1', isVariation: true },
  ],
  rows: [
    {
      id: 'ca',
      label: "Chiffre d'affaires",
      cells: {
        'N': { value: '2 400 000 €', trend: Trend.NEUTRAL },
        'variation.N-1': { value: '+12 %', trend: Trend.POSITIVE },
      },
    },
    {
      id: 'total',
      label: 'Total',
      role: LineRole.TOTAL,
      cells: { 'N': { value: '2 400 000 €', trend: Trend.NEUTRAL } },
    },
    {
      id: 'memo',
      label: 'Pour mémoire',
      role: LineRole.MEMO,
      cells: {},
    },
  ],
}

describe('headerRow', () => {

  it('should announce the line column, then each exercise on its own fill', () => {
    const [lineCell, plainCell] = headerRow(VIEW, LABELS, 1)

    expect(lineCell).toMatchObject({
      text: 'INDICATEURS',
      options: { align: 'left', fill: { color: TABLE_HEADER_FILL } },
    })
    expect(plainCell).toMatchObject({
      text: 'N (12/2025)',
      options: { align: 'right', fill: { color: TABLE_HEADER_FILL } },
    })
  })

  it('should write a dated column as two runs on the variation fill', () => {
    const [, , variationCell] = headerRow(VIEW, LABELS, 1)

    expect(variationCell.text).toEqual([
      { text: 'Évolution', options: { breakLine: true } },
      { text: 'vs N-1', options: expect.objectContaining({ bold: false }) },
    ])
    expect(variationCell.options.fill).toEqual({ color: TABLE_VARIATION_FILL })
  })
})

describe('bodyRows', () => {

  it('should colour a figure by its trend', () => {
    const [ordinary] = bodyRows(VIEW)

    expect(ordinary[1]).toMatchObject({
      text: '2 400 000 €',
      options: { color: TREND_COLOR[Trend.NEUTRAL], bold: false },
    })
    expect(ordinary[2]).toMatchObject({
      text: '+12 %',
      options: { color: TREND_COLOR[Trend.POSITIVE] },
    })
  })

  it('should set a total apart, bold on its own fill', () => {
    const [, total] = bodyRows(VIEW)

    expect(total[0]).toMatchObject({
      text: 'Total',
      options: { bold: true, fill: { color: EMPHASIS_FILL }, color: SLIDE_HEADING_COLOR },
    })
  })

  it('should write a memo line in italics and leave its holes empty', () => {
    const [, , memo] = bodyRows(VIEW)

    expect(memo[0]).toMatchObject({
      text: 'Pour mémoire',
      options: { italic: true, color: MEMO_COLOR },
    })
    expect(memo[1]).toMatchObject({
      text: EMPTY_VALUE,
      options: { color: MEMO_COLOR },
    })
  })
})
