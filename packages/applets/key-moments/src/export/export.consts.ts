import { Renderer, Trend } from '../enums/key-moments.enums'
import { CHART_RESIZE_DELAY } from '../const/key-moments.consts'

/* ------------------------------------------------------------------ *
 * Geometry of the deck, in inches — the unit a slide is laid out in.
 * ------------------------------------------------------------------ */

/** A 16:9 slide, the only layout the export produces. */
export const SLIDE_WIDTH = 10
export const SLIDE_HEIGHT = 5.625

export const SLIDE_MARGIN_X = 0.5
export const SLIDE_MARGIN_TOP = 0.42
export const SLIDE_MARGIN_BOTTOM = 0.38

/** Space between two widgets sharing a slide, the gutter of the grid on screen. */
export const SLIDE_GUTTER = 0.16

/**
 * Band the heading of a section takes above the widgets, its own margin
 * included — the ordinal, the overline and the title, as the page draws them.
 */
export const SLIDE_HEAD_HEIGHT = 0.62

/* ------------------------------------------------------------------ *
 * Section heading. Proportions match the page (76px ordinal, 30px
 * title, 10.5px overline on a 10-inch-wide report), scaled to slide units.
 * ------------------------------------------------------------------ */

export const SECTION_RANK_FONT_SIZE = 46
/** Stroke of the ghost ordinal, in points — the page draws 1.5px at 76px. */
export const SECTION_RANK_OUTLINE = 0.9
/**
 * Room the ordinal keeps, whatever it reads: two digits of the same width,
 * and the little air the title hangs off. The page sets no more.
 */
export const SECTION_RANK_WIDTH = 0.82
/**
 * The line the ordinal stands on, at its natural height. Both documents centre
 * a line in the box it was given: giving that box the very height of the line
 * is what makes the two place the numeral identically, whatever each of them
 * assumes of the ascenders and descenders around it.
 */
export const SECTION_RANK_HEIGHT = 0.77

export const SECTION_SUBTITLE_FONT_SIZE = 6.5
export const SECTION_SUBTITLE_HEIGHT = 0.14
/** Tracking of the overline, in points — 0.18em, as the page sets it. */
export const SECTION_SUBTITLE_TRACKING = 1.2

export const SECTION_TITLE_FONT_SIZE = 18
export const SECTION_TITLE_HEIGHT = 0.3

/* ------------------------------------------------------------------ *
 * What is written, and what can only be drawn.
 * ------------------------------------------------------------------ */

/**
 * Renderers a slide can only carry as a picture, and the suffix of the test id
 * their root element carries — capturing the drawing itself rather than the
 * whole widget, whose title and comment the deck writes as text.
 *
 * Every other renderer is written as PowerPoint text and tables, which the
 * reader can select, search and correct. A chart has no text to hand over: it
 * is a drawing, and stays one.
 */
export const DRAWN_RENDERERS: Partial<Record<Renderer, string>> = {
  [Renderer.CHART]: 'chart',
  [Renderer.WATERFALL]: 'waterfall',
  [Renderer.BALANCE_IMAGE]: 'balance-image',
}

/* ------------------------------------------------------------------ *
 * Typography — point sizes, and the height in inches a line of each
 * takes. The two are declared together: a height that stops matching
 * its font size is what makes a block overflow the box measured for it.
 * ------------------------------------------------------------------ */

export const WIDGET_TITLE_FONT_SIZE = 12
export const WIDGET_TITLE_HEIGHT = 0.3

export const TABLE_HEADER_FONT_SIZE = 7.5
/** Two lines — what the exercise is, then what it is dated on. */
export const TABLE_HEADER_HEIGHT = 0.38
export const TABLE_FONT_SIZE = 9
/** One line of a cell; a row wrapping onto two takes two of them. */
export const TABLE_LINE_HEIGHT = 0.155
export const TABLE_ROW_HEIGHT = 0.23
/**
 * Room the labels keep whatever the figures ask for. Under this a label wraps
 * onto four lines and the table stops being read as a column of statements.
 */
export const TABLE_MIN_LABEL_SHARE = 0.22
/** Left and right insets of a table cell, both together. */
export const TABLE_CELL_PADDING = 0.07

/**
 * Width of a character as a share of the point size. An average tuned on
 * amounts — digits, spaces and a currency sign — which is what the columns of
 * this report are sized for. Deliberately generous: a column measured too wide
 * costs some air, a column measured too narrow wraps and breaks the layout.
 */
export const CHAR_WIDTH_RATIO = 0.56

/** Points per inch, which is what turns a font size into a width. */
export const POINTS_PER_INCH = 72

/**
 * Height of a line as a multiple of its type size, in the PDF. PowerPoint
 * applies its own to a text box; the PDF has to be told, and this is the value
 * the heights of `export.consts` were tuned against.
 */
export const PDF_LINE_SPACING = 1.15

/**
 * How small the type may get before a widget is split over several slides
 * instead of being shrunk further. A deck is read from across a room: past this
 * the figures stop being legible, and a second slide is the honest answer.
 */
export const MIN_READABLE_SCALE = 0.8

export const SIDE_TITLE_FONT_SIZE = 9
export const SIDE_TITLE_HEIGHT = 0.26

export const NARRATIVE_FONT_SIZE = 8.5
export const NARRATIVE_LINE_HEIGHT = 0.21
export const NARRATIVE_TITLE_HEIGHT = 0.27

export const CARD_HEIGHT = 0.95
/** A hero takes a row of its own, and stands taller: it carries the figure. */
export const CARD_HERO_HEIGHT = 1.2
export const CARD_GAP = 0.12
/** Under this, a card no longer holds its figure on a single line. */
export const CARD_MIN_WIDTH = 1.8
export const CARD_TITLE_FONT_SIZE = 7
export const CARD_VALUE_FONT_SIZE = 17
export const CARD_HERO_VALUE_FONT_SIZE = 24
export const CARD_DETAIL_FONT_SIZE = 8
export const CARD_DETAIL_LINE_HEIGHT = 0.17
/** The stroke naming a card, drawn on its top edge as the page draws it. */
export const CARD_ACCENT_HEIGHT = 0.04

export const COMMENT_FONT_SIZE = 8.5
/** The heading of the editorial slot, written above what the firm wrote. */
export const COMMENT_LABEL_HEIGHT = 0.15
export const COMMENT_LINE_HEIGHT = 0.14
/** Air above the heading and under the last line of the note. */
export const COMMENT_PADDING = 0.07
/** What the slot takes for a single line, which is the least it ever takes. */
export const COMMENT_HEIGHT = 0.44

/** Air between the title of a widget, its body, and its comment. */
export const WIDGET_INNER_GAP = 0.07

/** Inset of every panel the deck draws — a widget, a card, the comment. */
export const PANEL_PADDING = 0.13

/* ------------------------------------------------------------------ *
 * Palette — the tokens of the design system, written as PptxGenJS reads
 * them: a hex without its hash.
 * ------------------------------------------------------------------ */

/**
 * The one face both documents are written in. Arial carries the very widths of
 * the Helvetica a PDF holds as a standard font: stated on the deck, the two
 * break their lines on the same word.
 */
export const SLIDE_FONT_FACE = 'Arial'

export const SLIDE_BACKGROUND = 'F4F5FA'
export const SLIDE_HEADING_COLOR = '0E0F30'
export const SLIDE_ACCENT_COLOR = '1AAB8E'
export const SLIDE_MUTED_COLOR = '6A6C8A'
/** Outline of the ghost ordinal of a section — same blued family, fainter. */
export const GHOST_STROKE_COLOR = 'D9DAEE'

export const WIDGET_FILL = 'FFFFFF'
export const LINE_COLOR = 'E6E7F0'
export const EMPHASIS_FILL = 'F2F3FB'
export const CARD_FILL = 'FBFBFE'
export const CARD_LABEL_COLOR = '6C757D'
export const MEMO_COLOR = '889BA8'

export const TABLE_HEADER_FILL = '0E0F30'
export const TABLE_HEADER_COLOR = 'FFFFFF'
/** A variation is set apart from the exercises it compares. */
export const TABLE_VARIATION_FILL = '1AAB8E'

export const COMMENT_FILL = 'D1FAF0'
export const COMMENT_LABEL_COLOR = '148670'

export const HERO_FILL = '0E0F30'
export const HERO_COLOR = 'FFFFFF'
export const HERO_LABEL_COLOR = 'B5F0EF'

/** How a figure reads once its variation is known. */
export const TREND_COLOR: Record<Trend, string> = {
  [Trend.POSITIVE]: '0A710B',
  [Trend.NEGATIVE]: 'B10303',
  [Trend.NEUTRAL]: '15171A',
}

/** Same reading, as the stroke naming a card rather than as a text colour. */
export const TREND_ACCENT_COLOR: Record<Trend, string> = {
  [Trend.POSITIVE]: '1AAB8E',
  [Trend.NEGATIVE]: 'B10303',
  [Trend.NEUTRAL]: '0E0F30',
}

/* ------------------------------------------------------------------ *
 * Capture — what is left of the screen reading, now that only the
 * drawings go through it.
 * ------------------------------------------------------------------ */

/** A slide is projected, never read at 100%: a drawing is captured twice as dense. */
export const CAPTURE_PIXEL_RATIO = 2

/**
 * Two widgets belong to the same row when their tops differ by less than this,
 * in pixels. A tolerance rather than an equality: a row is aligned to the pixel
 * on screen, never to the sub-pixel the layout actually computes.
 */
export const ROW_TOLERANCE = 4

/**
 * Time the report is left to lay itself out once `content-visibility` is
 * forced. A chart that was never displayed only redraws on the resize it then
 * observes, and its own debounce delays that redraw.
 */
export const LAYOUT_SETTLE_DELAY = CHART_RESIZE_DELAY + 150

/* ------------------------------------------------------------------ *
 * Recommendations — the blocks closing the deck. Written as text like
 * everything that is not a drawing, so they are laid out rather than
 * captured.
 * ------------------------------------------------------------------ */

/** Two columns, two rows. Beyond that a note stops being readable across a room. */
export const OFFERS_PER_SLIDE = 4
export const OFFER_COLUMNS = 2

export const OFFER_CATEGORY_FONT_SIZE = 8
export const OFFER_CATEGORY_HEIGHT = 0.2
export const OFFER_TITLE_FONT_SIZE = 12
export const OFFER_TITLE_HEIGHT = 0.3
export const OFFER_PRIORITY_FONT_SIZE = 9
export const OFFER_PRIORITY_HEIGHT = 0.24
export const OFFER_COMMENT_FONT_SIZE = 10
/** Heading written over each note of an offer, when the firm wrote one */
export const OFFER_COMMENT_LABEL_FONT_SIZE = 8
export const OFFER_COMMENT_LABEL_HEIGHT = 0.2
