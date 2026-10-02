import type { RecommendationPriority, RecommendationRubric } from '../enums/key-moments.enums'
import type { Card, Widget } from '../types/key-moments.types'
import type { PublishedRecommendationPayload } from '../types/recommendations.types'

/**
 * One widget of the report, ready to be laid on a slide. The widget itself is
 * carried rather than a picture of it: the deck writes its figures as text, and
 * only a renderer that is a drawing brings an image along.
 */
export interface SlideWidget {
  widget: Widget
  /** PNG data URL of the drawing, absent when the widget is written as text */
  image?: string
  /** Height over width of that drawing, the only thing of it the layout keeps */
  aspectRatio?: number
}

/**
 * The heading of a section, as the page announces it: its ordinal, its
 * overline, and its title. Carried rather than rebuilt, so that the page and
 * the exported document can never name a section differently.
 */
export interface SectionHead {
  /** Ordinal of the section in the report, already written as `01`, `02`… */
  rank: string
  title: string
  /** Overline announcing what the section is about; absent when unauthored */
  subtitle?: string
}

/**
 * One row of the grid, which is one slide. Reading the report is what produced
 * it, so the deck never has to know how the page packed its widgets.
 */
export interface SlideRow {
  /** Section the row belongs to, announced above the widgets */
  head: SectionHead
  widgets: SlideWidget[]
}

/** Rectangle a slide leaves to the widgets it lays out, in inches. */
export interface SlideArea {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Where one widget is drawn on its slide, in inches, and how much the row it
 * belongs to had to be reduced to fit. Text does not shrink with its box:
 * `scale` is what the renderer applies to its own type sizes, so that a row
 * made smaller stays as full as it was measured.
 */
export interface WidgetPlacement {
  x: number
  y: number
  width: number
  height: number
  scale: number
}

/**
 * The words the deck needs and the page owns. Translated by the caller rather
 * than looked up here: nothing below the page holds an i18n context.
 */
export interface DeckLabels {
  /** Title of the page, written as an overline above the entity */
  title: string
  /** Whose key moment the cover names: the dossier, as every surface names it */
  entityName: string
  /**
   * How the report is read — whose figures, on which exercise, against which
   * one, in which unit. Taken from the caption of the page rather than rebuilt,
   * so that the deck and the screen can never disagree on what they show.
   */
  caption: string[]
  /** Header of the first column of every table: what the line is */
  lineLabel: string
  assets: string
  liabilities: string
  narrativeStart: string
  narrativeEnd: string
  variation: string
  comment: string
  /** Marks the slides a widget too long for one of them continues on */
  continued: string
  /** Heading of the recommendations, which close the deck, and its overline */
  recommendationsTitle: string
  recommendationsSubtitle: string
  /** How each priority is named, since the deck writes it as a word */
  priorities: Record<RecommendationPriority, string>
  /** How each rubric is named: the microservice carries the key alone */
  rubrics: Record<RecommendationRubric, string>
  /** Headings of the three texts of a recommendation, and of its offers line */
  observations: string
  risk: string
  recommendation: string
  offers: string
}

/**
 * One slide of the recommendations: a rubric, or the part of it that fits. A
 * rubric never shares a slide; one too long continues on the next, its title
 * repeated and marked as a continuation.
 */
export interface RecommendationSlide {
  label: string
  recommendations: PublishedRecommendationPayload[]
  isContinued: boolean
}

/* ------------------------------------------------------------------ *
 * The surface the export draws on. Two documents answer it: a deck of
 * PowerPoint slides, and a PDF of the very same pages. The renderer is
 * written against this alone, so a figure written as text in one is
 * written as text in the other.
 * ------------------------------------------------------------------ */

/** How a run of text reads. Point sizes and hex colours, hash excluded. */
export interface SlideTextStyle {
  fontSize?: number
  bold?: boolean
  italic?: boolean
  color?: string
  /** Extra space between characters, in points */
  charSpacing?: number
}

/**
 * One run of a paragraph. A run is a line of its own: everything the export
 * writes as several runs writes them as several lines, `breakLine` marking all
 * but the last.
 */
export interface SlideTextRun {
  text: string
  options?: SlideTextStyle & { breakLine?: boolean }
}

export interface SlideTextOptions extends SlideTextStyle {
  x: number
  y: number
  w: number
  h: number
  align?: 'left' | 'center' | 'right'
  valign?: 'top' | 'middle'
  /** Line height as a multiple of the type size */
  lineSpacingMultiple?: number
  /** Inset of the box, in points */
  margin?: number
  /** Draws the letters as an outline, the stroke in points — the ghost ordinal */
  outline?: { color: string, size: number }
}

export interface SlideShapeOptions {
  x: number
  y: number
  w: number
  h: number
  fill?: { color: string }
  /** Stroke width in points; zero draws no outline */
  line?: { color?: string, width: number }
}

export interface SlideImageOptions {
  /** PNG data URL */
  data: string
  x: number
  y: number
  w: number
  h: number
}

export interface SlideTableCell {
  text: string | SlideTextRun[]
  options: SlideTextStyle & {
    align?: 'left' | 'center' | 'right'
    valign?: 'top' | 'middle'
    fill?: { color: string }
    colspan?: number
  }
}

export interface SlideTableOptions {
  x: number
  y: number
  w: number
  /** Width of every column, and height of every row, both in inches */
  colW: number[]
  rowH: number[]
  fontSize: number
  color?: string
  border?: { type: 'solid' | 'none', pt?: number, color?: string }
  /** Inset of a cell, in points */
  margin?: number
  /** Never true: the export lays its own pages out, and splits its own tables */
  autoPage?: boolean
}

/**
 * What a page can be asked to draw. The subset of the PptxGenJS slide API the
 * export uses, so that a slide answers it as it is and the PDF only has to
 * answer the same four questions.
 */
export interface SlideSurface {
  addText(text: string | SlideTextRun[], options: SlideTextOptions): void
  addShape(shape: 'rect', options: SlideShapeOptions): void
  addTable(rows: SlideTableCell[][], options: SlideTableOptions): void
  addImage(options: SlideImageOptions): void
}

/** The document the pages are written into, and the file it becomes. */
export interface DeckDocument {
  /** Opens a page, painted on the canvas of the report */
  addPage(): SlideSurface
  toBlob(): Promise<Blob>
}

/** Where one card is drawn inside the body of its widget, in inches. */
export interface CardPlacement {
  card: Card
  x: number
  y: number
  width: number
  height: number
}

/**
 * The box the cards are packed into. `scale` multiplies the heights the cards
 * are given, never their widths: measuring happens at scale 1, drawing at the
 * scale the row ended up reduced to, and the packing is identical in both.
 */
export interface CardsBox {
  x: number
  y: number
  width: number
  scale: number
}
