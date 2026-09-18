import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { Renderer } from '../enums/key-moments.enums'
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_HERO_HEIGHT,
  CARD_MIN_WIDTH,
  CHAR_WIDTH_RATIO,
  COMMENT_FONT_SIZE,
  COMMENT_HEIGHT,
  COMMENT_LABEL_HEIGHT,
  COMMENT_LINE_HEIGHT,
  COMMENT_PADDING,
  MIN_READABLE_SCALE,
  NARRATIVE_LINE_HEIGHT,
  NARRATIVE_TITLE_HEIGHT,
  PANEL_PADDING,
  POINTS_PER_INCH,
  SIDE_TITLE_HEIGHT,
  SLIDE_GUTTER,
  TABLE_CELL_PADDING,
  TABLE_FONT_SIZE,
  TABLE_HEADER_HEIGHT,
  TABLE_LINE_HEIGHT,
  TABLE_MIN_LABEL_SHARE,
  TABLE_ROW_HEIGHT,
  WIDGET_INNER_GAP,
  WIDGET_TITLE_HEIGHT,
} from './export.consts'
import type {
  Card,
  NarrativeView,
  TableView,
  Widget,
} from '../types/key-moments.types'
import type {
  CardPlacement,
  CardsBox,
  SlideArea,
  SlideRow,
  SlideWidget,
  WidgetPlacement,
} from './export.types'

/**
 * How wide everything is, how tall it stands, and where it goes. Pure: the deck
 * asks it what a widget will take before drawing anything, which is the only
 * way a slide made of text can be laid out — a table does not report its own
 * height the way a picture reports its shape.
 *
 * Every length here is measured at full size. A row that has to be reduced to
 * fit carries a `scale` the renderer applies to its type and its heights, never
 * to its widths: narrowing a column makes its text wrap, which makes the row
 * taller, which asks for a further reduction. Widths are settled once, here.
 */

/** Width a run of characters takes at a point size, in inches. */
export function textWidth(characters: number, fontSize: number): number {
  return characters * fontSize * CHAR_WIDTH_RATIO / POINTS_PER_INCH
}

/* ------------------------------------------------------------------ *
 * Tables
 * ------------------------------------------------------------------ */

/**
 * The longest a column ever gets, in characters. The two lines of a header are
 * counted apart: they are written as two lines, so the wider of them is what
 * the column has to hold — never their sum.
 */
function longestCell(view: TableView, columnIndex: number): number {
  const column = view.columns[columnIndex]
  const header = Math.max(column.title.length, column.caption?.length ?? 0)

  return view.rows.reduce(
    (longest, row) => Math.max(longest, row.cells[column.key]?.value.length ?? 0),
    header,
  )
}

/**
 * Columns are sized from what they carry rather than given a fixed share of the
 * width: an amount cut in half is unreadable, where a label wrapping onto a
 * second line is not. The labels therefore take what the figures leave, down to
 * a floor under which the figures give way instead.
 */
export function tableColumnWidths(view: TableView, width: number): number[] {
  const values = view.columns.map(
    (_, index) => textWidth(longestCell(view, index), TABLE_FONT_SIZE) + TABLE_CELL_PADDING,
  )

  const asked = values.reduce((total, value) => total + value, 0)
  const available = width * (1 - TABLE_MIN_LABEL_SHARE)

  // The figures are reduced together when they ask for more than their share
  const fitted = asked <= available ? values : values.map(value => value * available / asked)
  const spent = fitted.reduce((total, value) => total + value, 0)

  return [width - spent, ...fitted]
}

/** Lines a label wraps onto in the column it was given. */
function labelLines(label: string, labelWidth: number): number {
  const usable = Math.max(labelWidth - TABLE_CELL_PADDING, TABLE_CELL_PADDING)

  return Math.max(1, Math.ceil(textWidth(label.length, TABLE_FONT_SIZE) / usable))
}

/**
 * Height of every row of a table. A label too long for its column wraps, and a
 * row that wraps stands taller — the whole reason a table cannot be measured
 * from its line count alone.
 */
export function tableRowHeights(view: TableView, width: number): number[] {
  const [labelWidth] = tableColumnWidths(view, width)

  return view.rows.map(row => Math.max(
    TABLE_ROW_HEIGHT,
    labelLines(row.label, labelWidth) * TABLE_LINE_HEIGHT + TABLE_CELL_PADDING,
  ))
}

function tableHeight(view: TableView, width: number): number {
  return TABLE_HEADER_HEIGHT
    + tableRowHeights(view, width).reduce((total, height) => total + height, 0)
}

/* ------------------------------------------------------------------ *
 * Cards
 * ------------------------------------------------------------------ */

/** Cards left out by the editor are not exported: the deck shows the report. */
function visibleCards(cards: Card[]): Card[] {
  return cards.filter(card => card.isHidden === false)
}

/**
 * How many cards a row holds. Derived from the width the widget got rather than
 * authored, exactly as the `auto-fit` grid of the page derives it.
 */
function cardsPerRow(width: number): number {
  return Math.max(1, Math.floor((width + CARD_GAP) / (CARD_MIN_WIDTH + CARD_GAP)))
}

/**
 * Packs the cards into rows, a hero taking a row of its own — it is the figure
 * the widget is read for, and the page gives it the full width too.
 *
 * Shared by the measuring and the drawing, so that the height reserved for a
 * card block and the block actually drawn can never disagree.
 */
export function layoutCards(
  cards: Card[],
  box: CardsBox,
): CardPlacement[] {
  const gap = CARD_GAP * box.scale
  const height = CARD_HEIGHT * box.scale
  const heroHeight = CARD_HERO_HEIGHT * box.scale

  const perRow = cardsPerRow(box.width)
  const width = (box.width - CARD_GAP * (perRow - 1)) / perRow

  const placements: CardPlacement[] = []

  let y = box.y
  let rank = 0

  function closeRow(rowHeight: number): void {
    y += rowHeight + gap
    rank = 0
  }

  visibleCards(cards).forEach(card => {
    if (card.isHighlighted) {
      if (rank > 0) {
        closeRow(height)
      }

      placements.push({ card, x: box.x, y, width: box.width, height: heroHeight })
      closeRow(heroHeight)

      return
    }

    if (rank === perRow) {
      closeRow(height)
    }

    placements.push({ card, x: box.x + rank * (width + CARD_GAP), y, width, height })
    rank += 1
  })

  return placements
}

function cardsBlockHeight(cards: Card[], width: number): number {
  const placements = layoutCards(cards, { x: 0, y: 0, width, scale: 1 })

  if (placements.length === 0) {
    return 0
  }

  return Math.max(...placements.map(placement => placement.y + placement.height))
}

/* ------------------------------------------------------------------ *
 * Narrative
 * ------------------------------------------------------------------ */

/** A block is its title, its lines, and the line closing it. */
function narrativeHeight(view: NarrativeView): number {
  const sections = [
    view.head.length === 0 ? 0 : NARRATIVE_TITLE_HEIGHT + view.head.length * NARRATIVE_LINE_HEIGHT,
    ...view.blocks.map(block => NARRATIVE_TITLE_HEIGHT
      + (block.lines.length + (block.total === undefined ? 0 : 1)) * NARRATIVE_LINE_HEIGHT),
    view.footer.length === 0
      ? 0
      : NARRATIVE_TITLE_HEIGHT + view.footer.length * NARRATIVE_LINE_HEIGHT,
  ].filter(height => height > 0)

  return sections.reduce((total, height) => total + height, 0)
    + WIDGET_INNER_GAP * Math.max(0, sections.length - 1)
}

/* ------------------------------------------------------------------ *
 * Widgets
 * ------------------------------------------------------------------ */

/** Width the body of a widget draws in, its frame deducted. */
export function innerWidth(width: number): number {
  return width - PANEL_PADDING * 2
}

/**
 * Height the editorial slot stands at, at the width it was given: its heading,
 * then as many lines as what the firm wrote takes. Measured rather than fixed —
 * a note is prose, and a slot sized for two lines cuts the third in half.
 *
 * Takes the width **inside** the panel, never the width of the widget: the slot
 * is drawn there and insets its own text once more, and that second inset is
 * the width the lines are counted against.
 *
 * Shared by the measuring and the drawing, so the band drawn and the room
 * reserved for it can never disagree.
 */
/** True only when the slot is shown and carries a text, matching what the screen displays. */
export function hasCommentBand(widget: Widget): boolean {
  return widget.isCommentHidden === false && isNotNullNorEmpty(widget.comment)
}

export function commentHeight(comment: string, panelWidth: number): number {
  const usable = innerWidth(panelWidth)
  const lines = Math.max(
    1,
    Math.ceil(textWidth(comment.length, COMMENT_FONT_SIZE) / usable),
  )

  return Math.max(
    COMMENT_HEIGHT,
    COMMENT_PADDING * 2 + COMMENT_LABEL_HEIGHT + lines * COMMENT_LINE_HEIGHT,
  )
}

/** Height the body of a widget takes at the width it was given. */
function bodyHeight(slideWidget: SlideWidget, width: number): number {
  const { widget } = slideWidget

  if (slideWidget.aspectRatio !== undefined) {
    return width * slideWidget.aspectRatio
  }

  switch (widget.renderer) {
    case Renderer.TABLE:
      return widget.table === undefined ? 0 : tableHeight(widget.table, width)

    case Renderer.BALANCE_SHEET: {
      if (widget.balanceSheet === undefined) {
        return 0
      }

      const sideWidth = (width - SLIDE_GUTTER) / 2

      return SIDE_TITLE_HEIGHT + Math.max(
        tableHeight(widget.balanceSheet.assets, sideWidth),
        tableHeight(widget.balanceSheet.liabilities, sideWidth),
      )
    }

    case Renderer.NARRATIVE:
      return widget.narrative === undefined ? 0 : narrativeHeight(widget.narrative)

    default:
      return widget.cards === undefined ? 0 : cardsBlockHeight(widget.cards, width)
  }
}

/**
 * Height a widget stands at, at the width it was given: its frame, its title,
 * its body, and the editorial slot when it carries one. Measured at full size,
 * which is what the reduction is then computed from.
 */
export function measureWidget(slideWidget: SlideWidget, width: number): number {
  const comment = hasCommentBand(slideWidget.widget)
    ? WIDGET_INNER_GAP + commentHeight(slideWidget.widget.comment, innerWidth(width))
    : 0

  return PANEL_PADDING * 2
    + WIDGET_TITLE_HEIGHT
    + WIDGET_INNER_GAP
    + bodyHeight(slideWidget, innerWidth(width))
    + comment
}

/* ------------------------------------------------------------------ *
 * Rows
 * ------------------------------------------------------------------ */

/** Width each widget of a row is given, out of the area it shares. */
export function rowWidths(widgets: SlideWidget[], area: SlideArea): number[] {
  const totalSpan = widgets.reduce((total, { widget }) => total + widget.span, 0)
  const usableWidth = area.width - SLIDE_GUTTER * (widgets.length - 1)

  return widgets.map(({ widget }) => usableWidth * widget.span / totalSpan)
}

/**
 * Packs items into as few groups as each fitting the budget allows. `fits` is
 * asked about a whole candidate group rather than about one item, because what
 * a group costs is never the sum of its parts — a table carries a header, a
 * narrative the block titles that punctuate it.
 *
 * An item too large on its own opens a group anyway: a group is never empty,
 * and refusing to place it would loop forever.
 */
function chunkToBudget<T>(items: T[], fits: (candidate: T[]) => boolean): T[][] {
  const chunks: T[][] = []
  let current: T[] = []

  items.forEach(item => {
    const candidate = [...current, item]

    if (current.length > 0 && fits(candidate) === false) {
      chunks.push(current)
      current = [item]

      return
    }

    current = candidate
  })

  if (current.length > 0) {
    chunks.push(current)
  }

  return chunks
}

/** The same widget reading a slice of its lines. */
function withTableRows(
  slideWidget: SlideWidget,
  view: TableView,
  rows: TableView['rows'],
): Widget {
  return { ...slideWidget.widget, table: { ...view, rows } }
}

function splitTable(
  slideWidget: SlideWidget,
  view: TableView,
  width: number,
  budget: number,
): Widget[] {
  const chunks = chunkToBudget(view.rows, rows => measureWidget(
    { ...slideWidget, widget: withTableRows(slideWidget, view, rows) },
    width,
  ) <= budget)

  return chunks.map(rows => withTableRows(slideWidget, view, rows))
}

/**
 * A narrative is split on its blocks, never inside one: a block is a reasoning
 * closed by its own subtotal, and half of it says nothing. The opening lines
 * ride with the first part and the closing ones with the last, their height
 * held back from the budget throughout so that the last part still fits.
 */
function splitNarrative(
  slideWidget: SlideWidget,
  view: NarrativeView,
  width: number,
  budget: number,
): Widget[] {
  const closing = view.footer.length === 0
    ? 0
    : NARRATIVE_TITLE_HEIGHT + view.footer.length * NARRATIVE_LINE_HEIGHT + WIDGET_INNER_GAP

  /** The opening lines only weigh on the part that ends up carrying them. */
  function opening(blocks: NarrativeView['blocks']): NarrativeView['head'] {
    return blocks[0] === view.blocks[0] ? view.head : []
  }

  const chunks = chunkToBudget(view.blocks, blocks => measureWidget({
    ...slideWidget,
    widget: {
      ...slideWidget.widget,
      narrative: { head: opening(blocks), blocks, footer: [] },
    },
  }, width) <= budget - closing)

  return chunks.map((blocks, index) => ({
    ...slideWidget.widget,
    narrative: {
      head: index === 0 ? view.head : [],
      blocks,
      footer: index === chunks.length - 1 ? view.footer : [],
    },
  }))
}

/**
 * Splits a widget the slide could only show by shrinking it past legibility.
 * A table gives up lines and a narrative gives up blocks; a row of cards or a
 * drawing has nothing to give and is handed back whole, to be reduced as it
 * always was.
 */
function splitWidget(
  slideWidget: SlideWidget,
  width: number,
  budget: number,
): Widget[] {
  const { widget } = slideWidget

  if (widget.renderer === Renderer.TABLE && widget.table !== undefined) {
    return splitTable(slideWidget, widget.table, width, budget)
  }

  if (widget.renderer === Renderer.NARRATIVE && widget.narrative !== undefined) {
    return splitNarrative(slideWidget, widget.narrative, width, budget)
  }

  return [widget]
}

/**
 * Splits a row the slide could only show by shrinking it past legibility, into
 * as many readable ones as it takes. Only a lone widget is split: two widgets
 * of a row are read against each other, and cutting them apart would be cutting
 * that comparison.
 *
 * The header comes back on every part, and the editorial slot is written once,
 * under the last: a comment repeated four times reads as four comments.
 */
export function splitRow(
  row: SlideRow,
  area: SlideArea,
  continuedLabel: string,
): SlideRow[] {
  const [slideWidget] = row.widgets

  if (row.widgets.length !== 1) {
    return [row]
  }

  const [width] = rowWidths(row.widgets, area)

  if (area.height / measureWidget(slideWidget, width) >= MIN_READABLE_SCALE) {
    return [row]
  }

  const parts = splitWidget(slideWidget, width, area.height / MIN_READABLE_SCALE)

  if (parts.length <= 1) {
    return [row]
  }

  return parts.map((widget, index) => ({
    head: row.head,
    widgets: [{
      ...slideWidget,
      widget: {
        ...widget,
        title: index === 0 ? widget.title : `${widget.title} ${continuedLabel}`,
        isCommentHidden: widget.isCommentHidden || index !== parts.length - 1,
      },
    }],
  }))
}

/**
 * Widths come from the spans and never from the pixels measured on screen, so
 * that the same report exports the same deck whatever the width of the window
 * it was read in.
 *
 * They are read against the total span of the row rather than against the
 * twelve columns of the grid: a row carrying a single half-width widget fills
 * the slide with it, where honouring the grid would leave half of it blank.
 * What the deck keeps of the layout is the proportion between the widgets of a
 * row, which is what the row was authored for.
 */
export function layoutRow(
  widgets: SlideWidget[],
  area: SlideArea,
): WidgetPlacement[] {
  if (widgets.length === 0) {
    return []
  }

  const widths = rowWidths(widgets, area)
  const heights = widgets.map((slideWidget, index) => measureWidget(slideWidget, widths[index]))

  /**
   * A row taller than the slide is reduced as a whole rather than cropped: the
   * widgets of a row are read against each other, and reducing them apart would
   * be losing the proportions the layout is there to preserve.
   */
  const rowHeight = Math.max(...heights)
  const scale = Math.min(1, area.height / rowHeight)

  let x = area.x

  /**
   * Every widget of the row is given the whole height of the slide, as the grid
   * of the page gives its cells the height of their row: the frames line up,
   * and the editorial slot of each sits on the same bottom edge. What a widget
   * measured is the room its body needs, never the room its card may take.
   */
  return widths.map(width => {
    const placement = { x, y: area.y, width, height: area.height, scale }

    x += width + SLIDE_GUTTER

    return placement
  })
}
