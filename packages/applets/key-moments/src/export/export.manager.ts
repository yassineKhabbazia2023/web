import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import {
  GHOST_STROKE_COLOR,
  RECOMMENDATION_LABEL_FONT_SIZE,
  RECOMMENDATION_LABEL_HEIGHT,
  RECOMMENDATION_OFFERS_FONT_SIZE,
  RECOMMENDATION_OFFERS_HEIGHT,
  RECOMMENDATION_TEXT_FONT_SIZE,
  RECOMMENDATION_THEME_FONT_SIZE,
  RECOMMENDATION_THEME_HEIGHT,
  RECOMMENDATIONS_PER_SLIDE,
  RUBRIC_TITLE_FONT_SIZE,
  RUBRIC_TITLE_HEIGHT,
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
import { formatScreenRank } from '../utils/rank.utils'
import { groupedByRubric } from '../utils/recommendations.utils'
import type { RecommendationRubric } from '../enums/key-moments.enums'
import type { PublishedRecommendationPayload } from '../types/recommendations.types'
import type {
  DeckDocument,
  DeckLabels,
  RecommendationSlide,
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
    labels: DeckLabels,
    rows: SlideRow[],
    recommendations: PublishedRecommendationPayload[],
  ): Promise<Blob> {
    return await ExportManager.compose(await PptxDeck.create(), labels, rows, recommendations)
  }

  /**
   * The same report, on the same pages, written as a PDF. Nothing of the layout
   * is decided twice: only the document the pages are drawn into changes.
   */
  static async buildPdf(
    labels: DeckLabels,
    rows: SlideRow[],
    recommendations: PublishedRecommendationPayload[],
  ): Promise<Blob> {
    return await ExportManager.compose(await PdfDeck.create(), labels, rows, recommendations)
  }

  private static async compose(
    document: DeckDocument,
    labels: DeckLabels,
    rows: SlideRow[],
    recommendations: PublishedRecommendationPayload[],
  ): Promise<Blob> {
    ExportManager.addCover(document.addPage(), labels)

    /**
     * A row the slide could only show by shrinking it past legibility is split
     * first: the deck gains a slide rather than losing its figures to a type
     * size nobody can read from across a room.
     */
    const slides = rows.flatMap(row => splitRow(row, CONTENT_AREA, labels.continued))

    /**
     * The recommendations arrive as the client reads them — visible ones only,
     * in order — so nothing is filtered here: one rubric per slide, a long one
     * continued on the next.
     */
    const recommendationSlides = ExportManager.paginateRecommendations(
      recommendations,
      RECOMMENDATIONS_PER_SLIDE,
      labels.rubrics,
    )

    /**
     * The recommendations close the report, so they are numbered after the
     * sections that made it into it — the hidden ones are in neither. Read from
     * the highest ordinal actually written rather than from how many were: a
     * section whose every widget is hidden draws no slide, and counting the
     * slides would hand the recommendations a number a section already carries.
     */
    const recommendationsRank = formatScreenRank(
      slides.reduce((last, row) => Math.max(last, Number(row.head.rank)), 0),
    )

    const total = slides.length + recommendationSlides.length

    slides.forEach((row, index) => {
      const slide = document.addPage()

      ExportManager.addSectionHead(slide, row.head)

      layoutRow(row.widgets, CONTENT_AREA).forEach((placement, rank) => {
        drawWidget(slide, row.widgets[rank], placement, labels)
      })

      ExportManager.addPagination(slide, index + 1, total)
    })

    recommendationSlides.forEach((page, index) => {
      const slide = document.addPage()

      ExportManager.addSectionHead(slide, {
        rank: recommendationsRank,
        subtitle: labels.recommendationsSubtitle,
        title: page.isContinued
          ? `${labels.recommendationsTitle} ${labels.continued}`
          : labels.recommendationsTitle,
      })

      ExportManager.addRubric(slide, page, labels)
      ExportManager.addPagination(slide, slides.length + index + 1, total)
    })

    return await document.toBlob()
  }

  /**
   * One slide per rubric, and a rubric too long for one continued on the next
   * slides, in order — a rubric never shares a slide with another, and a
   * rubric with nothing draws none.
   */
  static paginateRecommendations(
    recommendations: PublishedRecommendationPayload[],
    capacity: number,
    rubricLabels: Record<RecommendationRubric, string>,
  ): RecommendationSlide[] {
    return groupedByRubric(recommendations).flatMap((rubric) => {
      const pageCount = Math.ceil(rubric.recommendations.length / capacity)

      return Array.from({ length: pageCount }, (_, page): RecommendationSlide => ({
        label: rubricLabels[rubric.rubric],
        recommendations: rubric.recommendations.slice(page * capacity, page * capacity + capacity),
        isContinued: page > 0,
      }))
    })
  }

  /** The rubric named once, then its recommendations stacked in the room left. */
  private static addRubric(slide: SlideSurface, page: RecommendationSlide, labels: DeckLabels): void {
    slide.addText(page.label, {
      x: CONTENT_AREA.x,
      y: CONTENT_AREA.y,
      w: CONTENT_AREA.width,
      h: RUBRIC_TITLE_HEIGHT,
      fontSize: RUBRIC_TITLE_FONT_SIZE,
      bold: true,
      color: SLIDE_HEADING_COLOR,
    })

    const top = CONTENT_AREA.y + RUBRIC_TITLE_HEIGHT
    const count = page.recommendations.length
    const blockHeight = (CONTENT_AREA.height - RUBRIC_TITLE_HEIGHT - SLIDE_GUTTER * (count - 1)) / count

    page.recommendations.forEach((recommendation, rank) => {
      ExportManager.addRecommendation(
        slide,
        recommendation,
        {
          x: CONTENT_AREA.x,
          y: top + rank * (blockHeight + SLIDE_GUTTER),
          width: CONTENT_AREA.width,
          height: blockHeight,
        },
        labels,
      )
    })
  }

  /**
   * One recommendation, **written** rather than captured: theme and priority
   * on one line, observations and risk side by side — a block left empty is
   * omitted and the other takes the row — the recommendation under them, and
   * the titles of the offers on a last line.
   */
  private static addRecommendation(
    slide: SlideSurface,
    recommendation: PublishedRecommendationPayload,
    area: SlideArea,
    labels: DeckLabels,
  ): void {
    let cursor = area.y

    const heading = recommendation.priority === undefined
      ? recommendation.theme
      : `${recommendation.theme} · ${labels.priorities[recommendation.priority]}`

    slide.addText(heading, {
      x: area.x,
      y: cursor,
      w: area.width,
      h: RECOMMENDATION_THEME_HEIGHT,
      fontSize: RECOMMENDATION_THEME_FONT_SIZE,
      bold: true,
      color: SLIDE_ACCENT_COLOR,
    })
    cursor += RECOMMENDATION_THEME_HEIGHT

    const offersLine = recommendation.offers.length === 0
      ? undefined
      : `${labels.offers} : ${recommendation.offers.map(offer => offer.title).join(' · ')}`
    const offersHeight = offersLine === undefined ? 0 : RECOMMENDATION_OFFERS_HEIGHT

    const pair = [
      { label: labels.observations, text: recommendation.observations },
      { label: labels.risk, text: recommendation.risk },
    ].filter((block): block is { label: string, text: string } => isNotNullNorEmpty(block.text))
    const advice = recommendation.recommendation
    const hasAdvice = isNotNullNorEmpty(advice)

    // The room left, shared between the pair row and the advice row
    const roomLeft = area.height - RECOMMENDATION_THEME_HEIGHT - offersHeight
    const rowCount = (pair.length > 0 ? 1 : 0) + (hasAdvice ? 1 : 0)
    const rowHeight = rowCount === 0 ? 0 : (roomLeft - SLIDE_GUTTER * (rowCount - 1)) / rowCount

    if (pair.length > 0) {
      const columnWidth = (area.width - SLIDE_GUTTER * (pair.length - 1)) / pair.length

      pair.forEach((block, column) => {
        ExportManager.addLabelledText(
          slide,
          block.label,
          block.text,
          { x: area.x + column * (columnWidth + SLIDE_GUTTER), y: cursor, width: columnWidth, height: rowHeight },
        )
      })
      cursor += rowHeight + SLIDE_GUTTER
    }

    if (hasAdvice) {
      ExportManager.addLabelledText(
        slide,
        labels.recommendation,
        advice,
        { x: area.x, y: cursor, width: area.width, height: rowHeight },
      )
    }

    if (offersLine !== undefined) {
      slide.addText(offersLine, {
        x: area.x,
        y: area.y + area.height - offersHeight,
        w: area.width,
        h: offersHeight,
        fontSize: RECOMMENDATION_OFFERS_FONT_SIZE,
        italic: true,
        color: SLIDE_MUTED_COLOR,
      })
    }
  }

  /** A heading over a text; a long text shrinks inside its box rather than being cut. */
  private static addLabelledText(slide: SlideSurface, label: string, text: string, area: SlideArea): void {
    slide.addText(label, {
      x: area.x,
      y: area.y,
      w: area.width,
      h: RECOMMENDATION_LABEL_HEIGHT,
      fontSize: RECOMMENDATION_LABEL_FONT_SIZE,
      bold: true,
      charSpacing: 1,
      color: SLIDE_MUTED_COLOR,
    })
    slide.addText(text, {
      x: area.x,
      y: area.y + RECOMMENDATION_LABEL_HEIGHT,
      w: area.width,
      h: Math.max(area.height - RECOMMENDATION_LABEL_HEIGHT, RECOMMENDATION_LABEL_HEIGHT),
      fontSize: RECOMMENDATION_TEXT_FONT_SIZE,
      color: SLIDE_HEADING_COLOR,
      valign: 'top',
    })
  }

  private static addCover(slide: SlideSurface, labels: DeckLabels): void {
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

    slide.addText(labels.entityName, {
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
