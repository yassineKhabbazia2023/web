import {
  hasCommentBand,
  layoutCards,
  layoutRow,
  measureWidget,
  splitRow,
  tableColumnWidths,
  tableRowHeights,
  textWidth,
} from './export.layout'
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_HERO_HEIGHT,
  COMMENT_HEIGHT,
  MIN_READABLE_SCALE,
  SLIDE_GUTTER,
  TABLE_FONT_SIZE,
  TABLE_MIN_LABEL_SHARE,
  TABLE_ROW_HEIGHT,
  WIDGET_INNER_GAP,
} from './export.consts'
import { Renderer, Trend } from '../enums/key-moments.enums'
import type { Card, TableView, Widget } from '../types/key-moments.types'
import type {
  SlideArea,
  SlideRow,
  SlideWidget,
} from './export.types'

/** A wide, short area, so that a tall widget overflows it and gets reduced. */
const AREA: SlideArea = { x: 0.5, y: 1, width: 9, height: 4 }

function makeWidget(
  span: number,
  renderer: Renderer,
  parts: Partial<Widget> = {},
): Widget {
  return {
    id: 'widget',
    title: 'Widget',
    comment: '',
    span,
    renderer,
    availableRenderers: [renderer],
    isHidden: false,
    isCommentHidden: true,
    ...parts,
  }
}

/** A widget the deck can only draw: its shape is all the layout knows of it. */
function drawn(span: number, aspectRatio: number): SlideWidget {
  return {
    widget: makeWidget(span, Renderer.CHART),
    image: 'data:image/png;base64,chart',
    aspectRatio,
  }
}

function makeTable(rowCount: number): TableView {
  return {
    columns: [{ key: 'n', title: 'N', isVariation: false }],
    rows: Array.from({ length: rowCount }, (_, rank) => ({
      id: `line-${rank}`,
      label: `Line ${rank}`,
      cells: { n: { value: '10', trend: Trend.NEUTRAL } },
    })),
  }
}

function written(span: number, rowCount: number, parts: Partial<Widget> = {}) {
  return {
    widget: makeWidget(span, Renderer.TABLE, { table: makeTable(rowCount), ...parts }),
  }
}

/** A narrative of `blockCount` blocks, opened and closed by a line of its own. */
function narrated(blockCount: number): SlideWidget {
  return {
    widget: makeWidget(12, Renderer.NARRATIVE, {
      narrative: {
        head: [{ id: 'start', label: 'Trésorerie au 01/01', value: '120 000 €' }],
        blocks: Array.from({ length: blockCount }, (_, rank) => ({
          letter: String.fromCharCode(65 + rank),
          lines: [
            { id: `${rank}-a`, label: 'Encaissements', value: '10 000 €' },
            { id: `${rank}-b`, label: 'Décaissements', value: '-4 000 €' },
          ],
          total: { id: `${rank}-t`, label: `Flux ${rank}`, value: '6 000 €' },
        })),
        footer: [{ id: 'end', label: 'Trésorerie au 31/12', value: '204 000 €' }],
      },
    }),
  }
}

function makeCard(id: string, parts: Partial<Card> = {}): Card {
  return {
    id,
    title: id,
    value: '10',
    trend: Trend.NEUTRAL,
    isSignColored: false,
    isHighlighted: false,
    isHidden: false,
    ...parts,
  }
}

describe('layoutRow', () => {
  it('should place nothing when the row is empty', () => {
    expect(layoutRow([], AREA)).toEqual([])
  })

  it('should give the whole width to a lone widget', () => {
    const [placement] = layoutRow([drawn(12, 0.2)], AREA)

    expect(placement.x).toBeCloseTo(AREA.x)
    expect(placement.width).toBeCloseTo(AREA.width)
  })

  it('should fill the width with a lone widget narrower than the grid', () => {
    // A row is read against its own total span: half a grid alone is not half a slide
    const [placement] = layoutRow([drawn(6, 0.2)], AREA)

    expect(placement.width).toBeCloseTo(AREA.width)
  })

  it('should split the width evenly between two widgets of the same span', () => {
    const [left, right] = layoutRow([drawn(6, 0.2), drawn(6, 0.2)], AREA)

    expect(left.width).toBeCloseTo(right.width)
    expect(left.width).toBeCloseTo((AREA.width - SLIDE_GUTTER) / 2)
    expect(right.x).toBeCloseTo(left.x + left.width + SLIDE_GUTTER)
    expect(left.y).toBeCloseTo(right.y)
  })

  it('should split the width in proportion to the spans', () => {
    const [wide, narrow] = layoutRow([drawn(8, 0.2), drawn(4, 0.2)], AREA)

    expect(wide.width).toBeCloseTo(narrow.width * 2)
    expect(wide.width + narrow.width + SLIDE_GUTTER).toBeCloseTo(AREA.width)
  })

  /**
   * The grid of the page stretches its cells to the height of their row, and a
   * row is a slide: a widget that measured short is drawn tall, its body at the
   * top and its editorial slot on the bottom edge.
   */
  it('should give the whole height of the area to a row that fits in it', () => {
    const [placement] = layoutRow([drawn(12, 0.2)], AREA)

    expect(placement.scale).toBe(1)
    expect(placement.height).toBeCloseTo(AREA.height)
    expect(placement.y).toBeCloseTo(AREA.y)
  })

  it('should reduce a row taller than the area until it fits', () => {
    const [placement] = layoutRow([drawn(12, 1.2)], AREA)

    expect(placement.scale).toBeLessThan(1)
    expect(placement.height).toBeCloseTo(AREA.height)
  })

  it('should never take width away from a row it reduces', () => {
    // Narrowing a column makes its text wrap, which makes the row taller still
    const [roomy] = layoutRow([drawn(12, 0.2)], AREA)
    const [cramped] = layoutRow([drawn(12, 1.2)], AREA)

    expect(cramped.width).toBeCloseTo(roomy.width)
    expect(cramped.width).toBeCloseTo(AREA.width)
    expect(cramped.x).toBeCloseTo(AREA.x)
  })

  it('should reduce every widget of a row by the same amount', () => {
    const [tall, short] = layoutRow([drawn(6, 2), drawn(6, 0.2)], AREA)

    expect(tall.scale).toBe(short.scale)
    expect(tall.scale).toBeLessThan(1)
    // Both frames stand on the same two edges, whatever each of them measured
    expect(tall.height).toBeCloseTo(AREA.height)
    expect(short.height).toBeCloseTo(AREA.height)
  })

  it('should hang every row off the top of the area', () => {
    const [placement] = layoutRow([drawn(12, 0.1)], AREA)

    expect(placement.y).toBeCloseTo(AREA.y)
  })

  it('should measure a written widget from its content, never from a shape', () => {
    expect(measureWidget(written(6, 12), 4)).toBeGreaterThan(measureWidget(written(6, 2), 4))
  })
})

describe('measureWidget', () => {
  it('should grow a table by one row height per line', () => {
    const four = measureWidget(written(12, 4), 9)
    const five = measureWidget(written(12, 5), 9)

    expect(five - four).toBeCloseTo(TABLE_ROW_HEIGHT)
  })

  it('should reserve room for the editorial slot only when it is shown', () => {
    const hidden = measureWidget(written(12, 4), 9)
    const shown = measureWidget(written(12, 4, { isCommentHidden: false, comment: 'Un mot' }), 9)

    expect(shown - hidden).toBeCloseTo(WIDGET_INNER_GAP + COMMENT_HEIGHT)
  })

  /**
   * The screen shows nothing for a slot with no text — one the firm took out,
   * or one nobody worded — and the deck must not draw an empty band for it.
   */
  it('should reserve no room for a shown slot that carries no text', () => {
    const hidden = measureWidget(written(12, 4), 9)
    const empty = measureWidget(written(12, 4, { isCommentHidden: false, comment: '' }), 9)

    expect(empty).toBeCloseTo(hidden)
    expect(hasCommentBand(written(12, 4, { isCommentHidden: false, comment: '' }).widget)).toBe(false)
    expect(hasCommentBand(written(12, 4, { isCommentHidden: false, comment: 'Un mot' }).widget)).toBe(true)
  })

  /**
   * A note is prose: the slot is measured from what the firm wrote, and a long
   * one is given the lines it takes rather than being cut by the band.
   */
  it('should grow the editorial slot with the note it carries', () => {
    const short = measureWidget(
      written(12, 4, { isCommentHidden: false, comment: 'La marge se tient.' }),
      9,
    )
    const long = measureWidget(
      written(12, 4, { isCommentHidden: false, comment: 'La marge se tient. '.repeat(20) }),
      9,
    )

    expect(long).toBeGreaterThan(short)
    expect(short).toBeCloseTo(
      measureWidget(written(12, 4, { isCommentHidden: false, comment: 'Un mot' }), 9),
    )
  })

  it('should read a drawing from its shape and the width it was given', () => {
    const narrow = measureWidget(drawn(12, 0.5), 4)
    const wide = measureWidget(drawn(12, 0.5), 8)

    // Only the body scales with the width; the title and the frame do not
    expect(wide - narrow).toBeCloseTo(2)
  })

  it('should read a balance sheet from its taller side', () => {
    const balanced = measureWidget({
      widget: makeWidget(12, Renderer.BALANCE_SHEET, {
        balanceSheet: { assets: makeTable(3), liabilities: makeTable(3) },
      }),
    }, 9)
    const lopsided = measureWidget({
      widget: makeWidget(12, Renderer.BALANCE_SHEET, {
        balanceSheet: { assets: makeTable(3), liabilities: makeTable(7) },
      }),
    }, 9)

    expect(lopsided - balanced).toBeCloseTo(TABLE_ROW_HEIGHT * 4)
  })

  it('should read a narrative from the lines it carries', () => {
    const view = {
      head: [{ id: 'h', label: 'Départ', value: '10' }],
      blocks: [{
        letter: 'A',
        lines: [{ id: 'a', label: 'Ligne', value: '1' }],
        total: { id: 't', label: 'Total', value: '11' },
      }],
      footer: [],
    }

    expect(measureWidget({
      widget: makeWidget(12, Renderer.NARRATIVE, { narrative: view }),
    }, 9)).toBeGreaterThan(0)
  })

  it('should take nothing for a body the widget does not carry', () => {
    const empty = measureWidget({ widget: makeWidget(12, Renderer.TABLE) }, 9)
    const filled = measureWidget(written(12, 1), 9)

    expect(empty).toBeLessThan(filled)
  })
})

describe('tableColumnWidths', () => {
  it('should spend exactly the width it was given', () => {
    const widths = tableColumnWidths(makeTable(3), 9)

    expect(widths.reduce((total, width) => total + width, 0)).toBeCloseTo(9)
  })

  it('should give a column holding longer figures more room', () => {
    const view = makeTable(1)
    view.columns = [
      { key: 'short', title: 'N', isVariation: false },
      { key: 'long', title: 'Var. N/N-1', isVariation: true },
    ]
    view.rows[0].cells = {
      short: { value: '10 €', trend: Trend.NEUTRAL },
      long: { value: '1 240 000 €', trend: Trend.NEUTRAL },
    }

    const [, short, long] = tableColumnWidths(view, 9)

    expect(long).toBeGreaterThan(short)
  })

  it('should measure a two-line header on its wider line, never on their sum', () => {
    const view = makeTable(1)
    view.columns = [{ key: 'n', title: 'Var.', caption: '12/2025 vs 12/2024', isVariation: true }]

    const [, column] = tableColumnWidths(view, 9)

    // Eighteen characters, not the twenty-two of the two lines glued together
    expect(column).toBeLessThan(textWidth(22, TABLE_FONT_SIZE))
  })

  it('should keep a floor for the labels when the figures ask for everything', () => {
    const view = makeTable(1)
    view.columns = Array.from({ length: 8 }, (_, rank) => ({
      key: `c${rank}`,
      title: 'Un intitulé de colonne démesurément long',
      isVariation: false,
    }))

    const [labelWidth] = tableColumnWidths(view, 9)

    expect(labelWidth).toBeCloseTo(9 * TABLE_MIN_LABEL_SHARE)
  })
})

describe('tableRowHeights', () => {
  it('should stand a row taller when its label wraps onto another line', () => {
    // Six exercises of amounts, as the report writes them: the labels get what
    // is left, and a long one no longer holds on a single line
    const view: TableView = {
      columns: Array.from({ length: 6 }, (_, rank) => ({
        key: `c${rank}`,
        title: `N-${rank}`,
        isVariation: false,
      })),
      rows: [
        { id: 'short', label: 'Marge brute', cells: {} },
        {
          id: 'long',
          label: 'Résultat générant un flux de trésorerie disponible pour les associés',
          cells: {},
        },
      ],
    }

    view.rows.forEach(row => {
      view.columns.forEach(column => {
        row.cells[column.key] = { value: '2 028 653 €', trend: Trend.NEUTRAL }
      })
    })

    const [short, long] = tableRowHeights(view, 9)

    expect(long).toBeGreaterThan(short)
  })

  it('should leave a short label on a single row height', () => {
    expect(tableRowHeights(makeTable(1), 9)).toEqual([TABLE_ROW_HEIGHT])
  })
})

describe('splitRow', () => {
  function makeRow(widgets: SlideWidget[]): SlideRow {
    return { head: { rank: '01', title: 'Votre activité' }, widgets }
  }

  it('should leave a row that can be read at the size it fits', () => {
    const row = makeRow([written(12, 4)])

    expect(splitRow(row, AREA, '(suite)')).toEqual([row])
  })

  it('should split a table too long to be read on one slide', () => {
    const parts = splitRow(makeRow([written(12, 40)]), AREA, '(suite)')

    expect(parts.length).toBeGreaterThan(1)

    const total = parts.reduce(
      (count, part) => count + (part.widgets[0].widget.table?.rows.length ?? 0),
      0,
    )

    expect(total).toBe(40)
  })

  it('should leave every part readable', () => {
    const parts = splitRow(makeRow([written(12, 40)]), AREA, '(suite)')

    parts.forEach(part => {
      expect(layoutRow(part.widgets, AREA)[0].scale)
        .toBeGreaterThanOrEqual(MIN_READABLE_SCALE)
    })
  })

  it('should mark every part but the first as a continuation', () => {
    const parts = splitRow(makeRow([written(12, 40)]), AREA, '(suite)')

    expect(parts[0].widgets[0].widget.title).toBe('Widget')
    expect(parts[1].widgets[0].widget.title).toBe('Widget (suite)')
  })

  it('should write the editorial slot under the last part only', () => {
    const parts = splitRow(
      makeRow([written(12, 40, { isCommentHidden: false })]),
      AREA,
      '(suite)',
    )

    expect(parts.slice(0, -1).every(part => part.widgets[0].widget.isCommentHidden)).toBe(true)
    expect(parts.at(-1)?.widgets[0].widget.isCommentHidden).toBe(false)
  })

  it('should keep the section every part belongs to', () => {
    const parts = splitRow(makeRow([written(12, 40)]), AREA, '(suite)')

    expect(parts.every(part => part.head.title === 'Votre activité')).toBe(true)
  })

  it('should leave a row carrying several widgets alone', () => {
    const row = makeRow([written(6, 40), written(6, 40)])

    expect(splitRow(row, AREA, '(suite)')).toEqual([row])
  })

  it('should leave a drawing alone: it has no lines to split', () => {
    const row = makeRow([drawn(12, 4)])

    expect(splitRow(row, AREA, '(suite)')).toEqual([row])
  })

  it('should split a narrative on its blocks', () => {
    const parts = splitRow(makeRow([narrated(14)]), AREA, '(suite)')

    expect(parts.length).toBeGreaterThan(1)

    const blocks = parts.reduce(
      (count, part) => count + (part.widgets[0].widget.narrative?.blocks.length ?? 0),
      0,
    )

    expect(blocks).toBe(14)
  })

  it('should open the narrative on its first part and close it on the last', () => {
    const parts = splitRow(makeRow([narrated(14)]), AREA, '(suite)')

    expect(parts[0].widgets[0].widget.narrative?.head).toHaveLength(1)
    expect(parts[0].widgets[0].widget.narrative?.footer).toHaveLength(0)
    expect(parts.at(-1)?.widgets[0].widget.narrative?.head).toHaveLength(0)
    expect(parts.at(-1)?.widgets[0].widget.narrative?.footer).toHaveLength(1)
  })

  it('should leave every part of a narrative readable, closing lines included', () => {
    splitRow(makeRow([narrated(14)]), AREA, '(suite)').forEach(part => {
      expect(layoutRow(part.widgets, AREA)[0].scale)
        .toBeGreaterThanOrEqual(MIN_READABLE_SCALE)
    })
  })
})

describe('layoutCards', () => {
  const BOX = { x: 1, y: 2, width: 6, scale: 1 }

  it('should lay several cards on one row while they fit', () => {
    const placements = layoutCards([makeCard('a'), makeCard('b')], BOX)

    expect(placements[0].y).toBe(placements[1].y)
    expect(placements[0].width).toBeCloseTo(placements[1].width)
    expect(placements[1].x).toBeCloseTo(placements[0].x + placements[0].width + CARD_GAP)
  })

  it('should give a card the width of a column, not of the row it sits alone on', () => {
    // Three cards fit across this box, so a lone card still takes one third of it
    const [alone] = layoutCards([makeCard('a')], BOX)
    const [first] = layoutCards(['a', 'b', 'c'].map(id => makeCard(id)), BOX)

    expect(alone.width).toBeCloseTo(first.width)
  })

  it('should wrap onto a new row once the width is spent', () => {
    const placements = layoutCards(
      ['a', 'b', 'c', 'd', 'e'].map(id => makeCard(id)),
      { ...BOX, width: 2 },
    )

    // A two-inch box holds a single card, so every one of them opens a row
    expect(new Set(placements.map(placement => placement.y)).size).toBe(5)
  })

  it('should give a hero a row of its own, at the full width', () => {
    const [hero, next] = layoutCards(
      [makeCard('hero', { isHighlighted: true }), makeCard('b')],
      BOX,
    )

    expect(hero.width).toBe(BOX.width)
    expect(hero.height).toBe(CARD_HERO_HEIGHT)
    expect(next.y).toBeCloseTo(hero.y + CARD_HERO_HEIGHT + CARD_GAP)
  })

  it('should close the row a hero interrupts', () => {
    const [first, hero] = layoutCards(
      [makeCard('a'), makeCard('hero', { isHighlighted: true })],
      BOX,
    )

    expect(hero.y).toBeCloseTo(first.y + CARD_HEIGHT + CARD_GAP)
  })

  it('should leave out the cards the editor hid', () => {
    const placements = layoutCards(
      [makeCard('a'), makeCard('b', { isHidden: true })],
      BOX,
    )

    expect(placements).toHaveLength(1)
    expect(placements[0].card.id).toBe('a')
  })

  it('should reduce the cards with the row they belong to', () => {
    const [placement] = layoutCards([makeCard('a')], { ...BOX, width: 3, scale: 0.5 })

    expect(placement.height).toBeCloseTo(CARD_HEIGHT / 2)
  })
})
