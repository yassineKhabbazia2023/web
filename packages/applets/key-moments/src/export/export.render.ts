import { LineRole, Renderer } from '../enums/key-moments.enums'
import { EMPTY_VALUE } from '../const/key-moments.consts'
import { formatVariation } from '../utils/variation.utils'
import {
  commentHeight,
  hasCommentBand,
  innerWidth,
  layoutCards,
  tableColumnWidths,
  tableRowHeights,
} from './export.layout'
import {
  CARD_ACCENT_HEIGHT,
  CARD_DETAIL_FONT_SIZE,
  CARD_DETAIL_LINE_HEIGHT,
  CARD_FILL,
  CARD_HERO_VALUE_FONT_SIZE,
  CARD_LABEL_COLOR,
  CARD_TITLE_FONT_SIZE,
  CARD_VALUE_FONT_SIZE,
  COMMENT_FILL,
  COMMENT_FONT_SIZE,
  COMMENT_LABEL_COLOR,
  EMPHASIS_FILL,
  HERO_COLOR,
  HERO_FILL,
  HERO_LABEL_COLOR,
  LINE_COLOR,
  MEMO_COLOR,
  NARRATIVE_FONT_SIZE,
  NARRATIVE_LINE_HEIGHT,
  NARRATIVE_TITLE_HEIGHT,
  PANEL_PADDING,
  SIDE_TITLE_FONT_SIZE,
  SIDE_TITLE_HEIGHT,
  SLIDE_ACCENT_COLOR,
  SLIDE_GUTTER,
  SLIDE_HEADING_COLOR,
  TABLE_FONT_SIZE,
  TABLE_HEADER_COLOR,
  TABLE_HEADER_FILL,
  TABLE_HEADER_FONT_SIZE,
  TABLE_HEADER_HEIGHT,
  TABLE_VARIATION_FILL,
  TREND_ACCENT_COLOR,
  TREND_COLOR,
  WIDGET_FILL,
  WIDGET_INNER_GAP,
  WIDGET_TITLE_FONT_SIZE,
  WIDGET_TITLE_HEIGHT,
} from './export.consts'
import type {
  Card,
  NarrativeView,
  TableView,
} from '../types/key-moments.types'
import type {
  CardPlacement,
  DeckLabels,
  SlideSurface,
  SlideTableCell,
  SlideWidget,
  WidgetPlacement,
} from './export.types'

/**
 * Draws a widget on its page. Everything but a chart is written as text and
 * tables: the figures stay selectable, searchable and correctable, and the file
 * weighs what a document weighs rather than what a screenshot does.
 *
 * The scale of the placement multiplies the type sizes and every height. It
 * never touches a width — a column narrowed is a column whose text wraps, and a
 * table that wraps stands taller than the box it was measured for. Widths are
 * the ones the layout settled at full size, and the two agree because both ask
 * the same functions.
 */

/** The box a widget draws in, once its own frame is deducted. */
interface InnerBox {
  x: number
  y: number
  width: number
  /** Room left to the body, which is what a drawing is fitted into */
  height: number
  scale: number
}

export function drawWidget(
  slide: SlideSurface,
  slideWidget: SlideWidget,
  placement: WidgetPlacement,
  labels: DeckLabels,
): void {
  const { widget } = slideWidget
  const { scale } = placement

  // Heights follow the reduction, widths do not — hence two paddings
  const insetY = PANEL_PADDING * scale

  slide.addShape('rect', {
    x: placement.x,
    y: placement.y,
    w: placement.width,
    h: placement.height,
    fill: { color: WIDGET_FILL },
    line: { color: LINE_COLOR, width: 0.5 },
  })

  const x = placement.x + PANEL_PADDING
  const width = innerWidth(placement.width)

  slide.addText(widget.title, {
    x,
    y: placement.y + insetY,
    w: width,
    h: WIDGET_TITLE_HEIGHT * scale,
    fontSize: WIDGET_TITLE_FONT_SIZE * scale,
    bold: true,
    color: SLIDE_HEADING_COLOR,
    margin: 0,
  })

  // As tall as what the firm wrote takes, so that a long note is read whole
  const commentBand = commentHeight(widget.comment, width) * scale

  const isCommentDrawn = hasCommentBand(widget)
  const commentSpace = isCommentDrawn
    ? WIDGET_INNER_GAP * scale + commentBand
    : 0

  const bodyY = placement.y + insetY + (WIDGET_TITLE_HEIGHT + WIDGET_INNER_GAP) * scale

  drawBody(slide, slideWidget, {
    x,
    y: bodyY,
    width,
    height: placement.y + placement.height - insetY - commentSpace - bodyY,
    scale,
  }, labels)

  if (isCommentDrawn) {
    drawComment(slide, widget.comment, labels, {
      x,
      y: placement.y + placement.height - insetY - commentBand,
      width,
      height: commentBand,
      scale,
    })
  }
}

function drawBody(
  slide: SlideSurface,
  slideWidget: SlideWidget,
  box: InnerBox,
  labels: DeckLabels,
): void {
  const { widget, image, aspectRatio } = slideWidget

  if (image !== undefined && aspectRatio !== undefined) {
    drawDrawing(slide, image, aspectRatio, box)

    return
  }

  switch (widget.renderer) {
    case Renderer.TABLE:
      if (widget.table !== undefined) {
        drawTable(slide, widget.table, box, labels)
      }

      return

    case Renderer.BALANCE_SHEET:
      if (widget.balanceSheet !== undefined) {
        drawBalanceSheet(slide, widget.balanceSheet, box, labels)
      }

      return

    case Renderer.NARRATIVE:
      if (widget.narrative !== undefined) {
        drawNarrative(slide, widget.narrative, box, labels)
      }

      return

    default:
      if (widget.cards !== undefined) {
        drawCards(slide, widget.cards, box, labels)
      }
  }
}

/**
 * A drawing keeps its shape whatever the box it landed in: it is fitted inside
 * and centred, never stretched to the room it was given.
 */
function drawDrawing(
  slide: SlideSurface,
  image: string,
  aspectRatio: number,
  box: InnerBox,
): void {
  const height = Math.min(box.height, box.width * aspectRatio)
  const width = height / aspectRatio

  slide.addImage({
    data: image,
    x: box.x + (box.width - width) / 2,
    y: box.y,
    w: width,
    h: height,
  })
}

/* ------------------------------------------------------------------ *
 * Tables — the renderer most of the report is written with.
 * ------------------------------------------------------------------ */

function isStrongRole(role?: LineRole): boolean {
  return role === LineRole.TOTAL || role === LineRole.SUBTOTAL
}

/**
 * Two lines in a header cell — what the column is, then what it is dated on.
 * Written as two runs with a break between them: a newline inside the string of
 * a cell is not one, and the two would end up glued into a single long line
 * that no column of figures is wide enough to hold.
 */
export function headerRow(view: TableView, labels: DeckLabels, scale: number) {
  const header = {
    fill: { color: TABLE_HEADER_FILL },
    color: TABLE_HEADER_COLOR,
    bold: true,
    fontSize: TABLE_HEADER_FONT_SIZE * scale,
    valign: 'middle' as const,
  }

  return [
    { text: labels.lineLabel.toUpperCase(), options: { ...header, align: 'left' as const } },
    ...view.columns.map(column => ({
      text: column.caption === undefined
        ? column.title
        : [
          { text: column.title, options: { breakLine: true } },
          {
            text: column.caption,
            options: { fontSize: (TABLE_HEADER_FONT_SIZE - 1) * scale, bold: false },
          },
        ],
      options: {
        ...header,
        align: 'right' as const,
        fill: { color: column.isVariation ? TABLE_VARIATION_FILL : TABLE_HEADER_FILL },
      },
    })),
  ]
}

export function bodyRows(view: TableView) {
  return view.rows.map(row => {
    const isStrong = isStrongRole(row.role)
    const isMemo = row.role === LineRole.MEMO
    const shared = {
      bold: isStrong,
      italic: isMemo,
      valign: 'middle' as const,
      ...(isStrong ? { fill: { color: EMPHASIS_FILL } } : {}),
    }

    return [
      {
        text: row.label,
        options: {
          ...shared,
          align: 'left' as const,
          color: isMemo ? MEMO_COLOR : SLIDE_HEADING_COLOR,
        },
      },
      ...view.columns.map(column => {
        const cell = row.cells[column.key]

        return {
          text: cell?.value ?? EMPTY_VALUE,
          options: {
            ...shared,
            align: 'right' as const,
            color: cell === undefined ? MEMO_COLOR : TREND_COLOR[cell.trend],
          },
        }
      }),
    ]
  })
}

function drawTable(
  slide: SlideSurface,
  view: TableView,
  box: InnerBox,
  labels: DeckLabels,
): void {
  slide.addTable(
    [headerRow(view, labels, box.scale), ...bodyRows(view)],
    {
      x: box.x,
      y: box.y,
      w: box.width,
      // The very widths the layout measured this table at
      colW: tableColumnWidths(view, box.width),
      rowH: [
        TABLE_HEADER_HEIGHT * box.scale,
        ...tableRowHeights(view, box.width).map(height => height * box.scale),
      ],
      fontSize: TABLE_FONT_SIZE * box.scale,
      color: SLIDE_HEADING_COLOR,
      border: { type: 'solid', pt: 0.5, color: LINE_COLOR },
      margin: 2,
      autoPage: false,
    },
  )
}

/**
 * Assets facing liabilities, each on half the width — how a balance sheet
 * balances, and how the page lays it out.
 */
function drawBalanceSheet(
  slide: SlideSurface,
  view: { assets: TableView, liabilities: TableView },
  box: InnerBox,
  labels: DeckLabels,
): void {
  const sideWidth = (box.width - SLIDE_GUTTER) / 2

  const sides = [
    { title: labels.assets, view: view.assets, x: box.x },
    { title: labels.liabilities, view: view.liabilities, x: box.x + sideWidth + SLIDE_GUTTER },
  ]

  sides.forEach(side => {
    slide.addText(side.title.toUpperCase(), {
      x: side.x,
      y: box.y,
      w: sideWidth,
      h: SIDE_TITLE_HEIGHT * box.scale,
      fontSize: SIDE_TITLE_FONT_SIZE * box.scale,
      bold: true,
      charSpacing: 1,
      color: SLIDE_ACCENT_COLOR,
      margin: 0,
    })

    drawTable(slide, side.view, {
      ...box,
      x: side.x,
      y: box.y + SIDE_TITLE_HEIGHT * box.scale,
      width: sideWidth,
    }, labels)
  })
}

/* ------------------------------------------------------------------ *
 * Narrative — a sentence and an amount per line, read in order.
 * ------------------------------------------------------------------ */

/**
 * Drawn as a borderless table rather than as stacked text boxes: the labels and
 * the amounts have to hang off the same two edges, which is what a table does.
 */
function drawNarrative(
  slide: SlideSurface,
  view: NarrativeView,
  box: InnerBox,
  labels: DeckLabels,
): void {
  const rows: SlideTableCell[][] = []
  const heights: number[] = []

  function addTitle(text: string): void {
    rows.push([{
      text,
      options: {
        colspan: 2,
        bold: true,
        fill: { color: EMPHASIS_FILL },
        color: SLIDE_HEADING_COLOR,
        align: 'left',
      },
    }])
    heights.push(NARRATIVE_TITLE_HEIGHT * box.scale)
  }

  function addLine(label: string, value: string, isStrong: boolean): void {
    rows.push([
      { text: label, options: { align: 'left', bold: isStrong, color: SLIDE_HEADING_COLOR } },
      { text: value, options: { align: 'right', bold: isStrong, color: SLIDE_HEADING_COLOR } },
    ])
    heights.push(NARRATIVE_LINE_HEIGHT * box.scale)
  }

  if (view.head.length > 0) {
    addTitle(labels.narrativeStart)
    view.head.forEach(line => addLine(line.label, line.value, false))
  }

  view.blocks.forEach(block => {
    addTitle(block.total?.label ?? EMPTY_VALUE)
    block.lines.forEach(line => addLine(line.label, line.value, false))

    if (block.total !== undefined) {
      addLine(`${block.letter}  ${block.total.label}`, block.total.value, true)
    }
  })

  if (view.footer.length > 0) {
    addTitle(labels.narrativeEnd)
    view.footer.forEach(line => addLine(line.label, line.value, true))
  }

  if (rows.length === 0) {
    return
  }

  slide.addTable(rows, {
    x: box.x,
    y: box.y,
    w: box.width,
    colW: [box.width * 0.66, box.width * 0.34],
    rowH: heights,
    fontSize: NARRATIVE_FONT_SIZE * box.scale,
    border: { type: 'none' },
    margin: 2,
    autoPage: false,
  })
}

/* ------------------------------------------------------------------ *
 * Cards — a figure, what it was, and how it moved.
 * ------------------------------------------------------------------ */

/**
 * Puts a caption and the figure it names on one line, where the screen stacks
 * them: a slide has the width for it and not the height. Nothing to do with the
 * separator of an evolution, which happens to be drawn the same.
 */
const LABEL_VALUE_SEPARATOR = ' · '

function drawCards(
  slide: SlideSurface,
  cards: Card[],
  box: InnerBox,
  labels: DeckLabels,
): void {
  layoutCards(cards, box).forEach(placement => {
    const { card } = placement
    const isHero = card.isHighlighted
    const { scale } = box

    slide.addShape('rect', {
      x: placement.x,
      y: placement.y,
      w: placement.width,
      h: placement.height,
      fill: { color: isHero ? HERO_FILL : CARD_FILL },
      line: { color: isHero ? HERO_FILL : LINE_COLOR, width: 0.5 },
    })

    // The stroke naming the card: its indicator colour, or how it reads
    slide.addShape('rect', {
      x: placement.x,
      y: placement.y,
      w: placement.width,
      h: CARD_ACCENT_HEIGHT * scale,
      // A colour authored for the screen carries its hash; a surface reads none
      fill: { color: (card.color ?? TREND_ACCENT_COLOR[card.trend]).replaceAll('#', '') },
      line: { width: 0 },
    })

    const textX = placement.x + PANEL_PADDING
    const textWidth = placement.width - PANEL_PADDING * 2

    slide.addText(card.title.toUpperCase(), {
      x: textX,
      y: placement.y + CARD_ACCENT_HEIGHT * scale + 0.04 * scale,
      w: textWidth,
      h: 0.16 * scale,
      fontSize: CARD_TITLE_FONT_SIZE * scale,
      bold: true,
      charSpacing: 1,
      color: isHero ? HERO_LABEL_COLOR : CARD_LABEL_COLOR,
      margin: 0,
    })

    if (card.value !== undefined) {
      slide.addText(card.value, {
        x: textX,
        y: placement.y + 0.24 * scale,
        w: textWidth,
        h: (isHero ? 0.5 : 0.36) * scale,
        fontSize: (isHero ? CARD_HERO_VALUE_FONT_SIZE : CARD_VALUE_FONT_SIZE) * scale,
        bold: true,
        color: isHero
          ? HERO_COLOR
          : (card.isSignColored ? TREND_COLOR[card.trend] : SLIDE_HEADING_COLOR),
        margin: 0,
      })
    }

    drawCardFooter(slide, placement, labels, scale)
  })
}

/**
 * What the figure is read against, on the bottom edge of the card: the exercises
 * that drove an effect, or the previous period and the evolution.
 */
function drawCardFooter(
  slide: SlideSurface,
  placement: CardPlacement,
  labels: DeckLabels,
  scale: number,
): void {
  const { card } = placement
  const isHero = card.isHighlighted
  const lineHeight = CARD_DETAIL_LINE_HEIGHT * scale

  const detail = {
    x: placement.x + PANEL_PADDING,
    w: placement.width - PANEL_PADDING * 2,
    h: lineHeight,
    fontSize: CARD_DETAIL_FONT_SIZE * scale,
    margin: 0,
    color: isHero ? HERO_COLOR : SLIDE_HEADING_COLOR,
  }

  const bottom = placement.y + placement.height - PANEL_PADDING * scale

  if (card.references !== undefined) {
    const { references } = card

    references.forEach((reference, rank) => {
      slide.addText(`${reference.label}${LABEL_VALUE_SEPARATOR}${reference.text}`, {
        ...detail,
        y: bottom - (references.length - rank) * lineHeight,
        align: 'left',
      })
    })

    return
  }

  const footerY = bottom - lineHeight

  if (card.previous !== undefined) {
    slide.addText(`${card.previous.label}${LABEL_VALUE_SEPARATOR}${card.previous.text}`, {
      ...detail,
      y: footerY,
      w: detail.w / 2,
      align: 'left',
    })
  }

  const variation = formatVariation(card)

  if (variation.length > 0) {
    slide.addText(`${labels.variation} ${variation}`, {
      ...detail,
      x: detail.x + detail.w / 2,
      y: footerY,
      w: detail.w / 2,
      align: 'right',
      bold: true,
      color: isHero ? HERO_LABEL_COLOR : TREND_COLOR[card.trend],
    })
  }
}

/* ------------------------------------------------------------------ *
 * Comment — the editorial slot, kept as text like everything else.
 * ------------------------------------------------------------------ */

function drawComment(
  slide: SlideSurface,
  comment: string,
  labels: DeckLabels,
  box: InnerBox,
): void {
  slide.addShape('rect', {
    x: box.x,
    y: box.y,
    w: box.width,
    h: box.height,
    fill: { color: COMMENT_FILL },
    line: { width: 0 },
  })

  slide.addText(
    [
      {
        text: labels.comment.toUpperCase(),
        options: {
          fontSize: (COMMENT_FONT_SIZE - 1.5) * box.scale,
          bold: true,
          charSpacing: 1,
          color: COMMENT_LABEL_COLOR,
          breakLine: true,
        },
      },
      {
        text: comment,
        options: { fontSize: COMMENT_FONT_SIZE * box.scale, color: SLIDE_HEADING_COLOR },
      },
    ],
    {
      x: box.x + PANEL_PADDING,
      y: box.y,
      w: box.width - PANEL_PADDING * 2,
      h: box.height,
      valign: 'middle',
      margin: 0,
    },
  )
}
