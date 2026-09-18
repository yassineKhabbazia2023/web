import {
  GHOST_STROKE_COLOR,
  OFFER_CATEGORY_FONT_SIZE,
  OFFER_CATEGORY_HEIGHT,
  OFFER_COLUMNS,
  OFFER_COMMENT_FONT_SIZE,
  OFFER_COMMENT_LABEL_FONT_SIZE,
  OFFER_COMMENT_LABEL_HEIGHT,
  OFFER_PRIORITY_FONT_SIZE,
  OFFER_PRIORITY_HEIGHT,
  OFFER_TITLE_FONT_SIZE,
  OFFER_TITLE_HEIGHT,
  OFFERS_PER_SLIDE,
  SECTION_RANK_FONT_SIZE,
  SECTION_RANK_HEIGHT,
  SECTION_RANK_OUTLINE,
  SECTION_RANK_WIDTH,
  SECTION_SUBTITLE_FONT_SIZE,
  SECTION_SUBTITLE_HEIGHT,
  SECTION_SUBTITLE_TRACKING,
  SECTION_TITLE_FONT_SIZE,
  SECTION_TITLE_HEIGHT,
  SLIDE_ACCENT_COLOR,
  SLIDE_BACKGROUND,
  SLIDE_GUTTER,
  SLIDE_HEAD_HEIGHT,
  SLIDE_HEADING_COLOR,
  SLIDE_HEIGHT,
  SLIDE_MARGIN_BOTTOM,
  SLIDE_MARGIN_TOP,
  SLIDE_MARGIN_X,
  SLIDE_MUTED_COLOR,
  SLIDE_WIDTH,
} from './export.consts'
import { layoutRow, splitRow } from './export.layout'
import { drawWidget } from './export.render'
import { PdfDeck } from './export.pdf'
import { PptxDeck } from './export.pptx'
import type { LinkedOffer, Report } from '../types/key-moments.types'
import { formatScreenRank } from '../utils/rank.utils'
import type {
  DeckDocument,
  DeckLabels,
  SectionHead,
  SlideArea,
  SlideRow,
  SlideSurface,
} from './export.types'

/** Rectangle the widgets of a slide are laid out in, the same on every slide. */
const CONTENT_AREA: SlideArea = {
  x: SLIDE_MARGIN_X,
  y: SLIDE_MARGIN_TOP + SLIDE_HEAD_HEIGHT,
  width: SLIDE_WIDTH - SLIDE_MARGIN_X * 2,
  height: SLIDE_HEIGHT
    - SLIDE_MARGIN_TOP
    - SLIDE_HEAD_HEIGHT
    - SLIDE_MARGIN_BOTTOM,
}

export class ExportManager {
  /**
   * Assembles the deck: a cover stating how the report is read, then one slide
   * per row of the grid. Takes the rows rather than reading them, so that what
   * it lays out can be checked without a browser.
   */
  static async buildDeck(
    report: Report,
    labels: DeckLabels,
    rows: SlideRow[],
    offers: LinkedOffer[] = [],
  ): Promise<Blob> {
    return await ExportManager.compose(await PptxDeck.create(), report, labels, rows, offers)
  }

  /**
   * The same report, on the same pages, written as a PDF. Nothing of the layout
   * is decided twice: only the document the pages are drawn into changes.
   */
  static async buildPdf(
    report: Report,
    labels: DeckLabels,
    rows: SlideRow[],
    offers: LinkedOffer[] = [],
  ): Promise<Blob> {
    return await ExportManager.compose(await PdfDeck.create(), report, labels, rows, offers)
  }

  private static async compose(
    document: DeckDocument,
    report: Report,
    labels: DeckLabels,
    rows: SlideRow[],
    offers: LinkedOffer[],
  ): Promise<Blob> {
    ExportManager.addCover(document.addPage(), report, labels)

    /**
     * A row the slide could only show by shrinking it past legibility is split
     * first: the deck gains a slide rather than losing its figures to a type
     * size nobody can read from across a room.
     */
    const slides = rows.flatMap(row => splitRow(row, CONTENT_AREA, labels.continued))

    /**
     * Only what would be published. The rows were already read that way —
     * `collectTargets` leaves the hidden sub-sections out — so the
     * recommendations are filtered here on the same rule rather than on one of
     * their own: the deck states what the client would get, never the working
     * screen with its badges.
     */
    const published = offers.filter(offer => offer.isHidden === false)
    const offerPages = ExportManager.paginate(published, OFFERS_PER_SLIDE)

    /**
     * The recommendations close the report, so they are numbered after the
     * sections that made it into it — the hidden ones are in neither. Read from
     * the highest ordinal actually written rather than from how many were: a
     * section whose every widget is hidden draws no slide, and counting the
     * slides would hand the recommendations a number a section already carries.
     */
    const offersRank = formatScreenRank(
      slides.reduce((last, row) => Math.max(last, Number(row.head.rank)), 0),
    )

    const total = slides.length + offerPages.length

    slides.forEach((row, index) => {
      const slide = document.addPage()

      ExportManager.addSectionHead(slide, row.head)

      layoutRow(row.widgets, CONTENT_AREA).forEach((placement, rank) => {
        drawWidget(slide, row.widgets[rank], placement, labels)
      })

      ExportManager.addPagination(slide, index + 1, total)
    })

    offerPages.forEach((page, index) => {
      const slide = document.addPage()

      ExportManager.addSectionHead(slide, {
        rank: offersRank,
        subtitle: labels.offersSubtitle,
        title: index === 0
          ? labels.offersTitle
          : `${labels.offersTitle} ${labels.continued}`,
      })

      page.forEach((offer, rank) => {
        ExportManager.addOffer(slide, offer, rank, labels)
      })

      ExportManager.addPagination(slide, slides.length + index + 1, total)
    })

    return await document.toBlob()
  }

  /** Cut into pages of at most `size`, keeping the order it was given. */
  private static paginate<Item>(items: Item[], size: number): Item[][] {
    return Array.from(
      { length: Math.ceil(items.length / size) },
      (_, page) => items.slice(page * size, page * size + size),
    )
  }

  /**
   * One recommendation, **written** rather than captured: a card is text, and
   * the reader of the deck must be able to select it, search it and correct it
   * in PowerPoint — only a drawing has nothing to hand over.
   *
   * The degree is written whatever `isPriorityVisible` says. The deck is an
   * internal document: hiding from the firm the arbitration it made itself
   * would say nothing to anybody — the flag settles what the *client* reads.
   */
  private static addOffer(
    slide: SlideSurface,
    offer: LinkedOffer,
    rank: number,
    labels: DeckLabels,
  ): void {
    const columnWidth = (CONTENT_AREA.width - SLIDE_GUTTER * (OFFER_COLUMNS - 1)) / OFFER_COLUMNS
    const rowCount = OFFERS_PER_SLIDE / OFFER_COLUMNS
    const rowHeight = (CONTENT_AREA.height - SLIDE_GUTTER * (rowCount - 1)) / rowCount

    const x = CONTENT_AREA.x + (rank % OFFER_COLUMNS) * (columnWidth + SLIDE_GUTTER)
    const y = CONTENT_AREA.y
      + Math.floor(rank / OFFER_COLUMNS) * (rowHeight + SLIDE_GUTTER)

    let cursor = y

    if (offer.categoryName !== undefined) {
      slide.addText(offer.categoryName.toUpperCase(), {
        x,
        y: cursor,
        w: columnWidth,
        h: OFFER_CATEGORY_HEIGHT,
        fontSize: OFFER_CATEGORY_FONT_SIZE,
        charSpacing: 1,
        color: SLIDE_MUTED_COLOR,
      })
      cursor += OFFER_CATEGORY_HEIGHT
    }

    slide.addText(offer.title, {
      x,
      y: cursor,
      w: columnWidth,
      h: OFFER_TITLE_HEIGHT,
      fontSize: OFFER_TITLE_FONT_SIZE,
      bold: true,
      color: SLIDE_HEADING_COLOR,
    })
    cursor += OFFER_TITLE_HEIGHT

    if (offer.priority !== undefined) {
      slide.addText(labels.offerPriorities[offer.priority], {
        x,
        y: cursor,
        w: columnWidth,
        h: OFFER_PRIORITY_HEIGHT,
        fontSize: OFFER_PRIORITY_FONT_SIZE,
        bold: true,
        color: SLIDE_ACCENT_COLOR,
      })
      cursor += OFFER_PRIORITY_HEIGHT
    }

    // the two notes of the firm, each under its heading, and the catalogue's
    // own words only when the firm wrote neither
    const notes: { label?: string, text: string }[] = [
      { label: labels.offerComment, text: offer.comment ?? '' },
      { label: labels.offerBenefitsComment, text: offer.benefitsComment ?? '' },
    ].filter(note => note.text.length > 0)

    if (notes.length === 0) {
      if (offer.shortDescription === undefined || offer.shortDescription.length === 0) {
        return
      }

      notes.push({ text: offer.shortDescription })
    }

    const noteHeight = Math.max(rowHeight - (cursor - y), OFFER_PRIORITY_HEIGHT * notes.length)
      / notes.length

    notes.forEach((note) => {
      let textY = cursor
      let textHeight = noteHeight

      if (note.label !== undefined) {
        slide.addText(note.label, {
          x,
          y: cursor,
          w: columnWidth,
          h: OFFER_COMMENT_LABEL_HEIGHT,
          fontSize: OFFER_COMMENT_LABEL_FONT_SIZE,
          bold: true,
          color: SLIDE_HEADING_COLOR,
        })
        textY += OFFER_COMMENT_LABEL_HEIGHT
        textHeight -= OFFER_COMMENT_LABEL_HEIGHT
      }

      // a long note shrinks inside its box rather than overflowing it or being
      // cut: nothing the firm wrote is dropped on the way to the deck
      slide.addText(note.text, {
        x,
        y: textY,
        w: columnWidth,
        h: Math.max(textHeight, OFFER_PRIORITY_HEIGHT),
        fontSize: OFFER_COMMENT_FONT_SIZE,
        color: SLIDE_MUTED_COLOR,
        valign: 'top',
      })
      cursor += noteHeight
    })
  }

  private static addCover(slide: SlideSurface, report: Report, labels: DeckLabels): void {
    slide.addText(labels.title.toUpperCase(), {
      x: SLIDE_MARGIN_X,
      y: 1.9,
      w: SLIDE_WIDTH - SLIDE_MARGIN_X * 2,
      h: 0.3,
      fontSize: 11,
      bold: true,
      charSpacing: 3,
      color: SLIDE_ACCENT_COLOR,
    })

    slide.addText(report.entity.name, {
      x: SLIDE_MARGIN_X,
      y: 2.2,
      w: SLIDE_WIDTH - SLIDE_MARGIN_X * 2,
      h: 0.7,
      fontSize: 34,
      bold: true,
      color: SLIDE_HEADING_COLOR,
    })

    slide.addText(labels.caption.join('\n'), {
      x: SLIDE_MARGIN_X,
      y: 3,
      w: SLIDE_WIDTH - SLIDE_MARGIN_X * 2,
      h: 1,
      fontSize: 12,
      lineSpacingMultiple: 1.3,
      color: SLIDE_MUTED_COLOR,
    })
  }

  /**
   * The heading of the section the slide belongs to, drawn as the page draws
   * it: the ghost ordinal, then the overline and the title hanging off it, all
   * three sitting on the same line as they do on screen.
   */
  private static addSectionHead(slide: SlideSurface, head: SectionHead): void {
    const bottom = SLIDE_MARGIN_TOP + SLIDE_HEAD_HEIGHT - SLIDE_GUTTER

    const written = head.subtitle === undefined
      ? SECTION_TITLE_HEIGHT
      : SECTION_TITLE_HEIGHT + SECTION_SUBTITLE_HEIGHT

    // The ordinal is read against the two lines beside it: it hangs off their
    // middle rather than off an edge either of them happens to sit on
    slide.addText(head.rank, {
      x: SLIDE_MARGIN_X,
      y: bottom - written / 2 - SECTION_RANK_HEIGHT / 2,
      w: SECTION_RANK_WIDTH,
      h: SECTION_RANK_HEIGHT,
      fontSize: SECTION_RANK_FONT_SIZE,
      bold: true,
      valign: 'middle',
      // hollow: the canvas as its fill, the faintest line of the palette as
      // its stroke — a numeral that numbers without being read
      color: SLIDE_BACKGROUND,
      outline: { color: GHOST_STROKE_COLOR, size: SECTION_RANK_OUTLINE },
      margin: 0,
    })

    const x = SLIDE_MARGIN_X + SECTION_RANK_WIDTH
    const width = SLIDE_WIDTH - SLIDE_MARGIN_X - x

    if (head.subtitle !== undefined) {
      slide.addText(head.subtitle.toUpperCase(), {
        x,
        y: bottom - SECTION_TITLE_HEIGHT - SECTION_SUBTITLE_HEIGHT,
        w: width,
        h: SECTION_SUBTITLE_HEIGHT,
        fontSize: SECTION_SUBTITLE_FONT_SIZE,
        bold: true,
        charSpacing: SECTION_SUBTITLE_TRACKING,
        color: SLIDE_ACCENT_COLOR,
        valign: 'middle',
        margin: 0,
      })
    }

    slide.addText(head.title, {
      x,
      y: bottom - SECTION_TITLE_HEIGHT,
      w: width,
      h: SECTION_TITLE_HEIGHT,
      fontSize: SECTION_TITLE_FONT_SIZE,
      bold: true,
      color: SLIDE_HEADING_COLOR,
      valign: 'middle',
      margin: 0,
    })
  }

  private static addPagination(slide: SlideSurface, rank: number, total: number): void {
    slide.addText(`${rank}/${total}`, {
      x: SLIDE_WIDTH - SLIDE_MARGIN_X - 1,
      y: SLIDE_HEIGHT - SLIDE_MARGIN_BOTTOM,
      w: 1,
      h: SLIDE_MARGIN_BOTTOM,
      align: 'right',
      fontSize: 9,
      color: SLIDE_MUTED_COLOR,
    })
  }
}
