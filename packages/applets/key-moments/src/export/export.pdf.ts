import {
  PDF_LINE_SPACING,
  POINTS_PER_INCH,
  SLIDE_BACKGROUND,
  SLIDE_HEADING_COLOR,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
} from './export.consts'
import type { jsPDF } from 'jspdf'
import type {
  DeckDocument,
  SlideImageOptions,
  SlideShapeOptions,
  SlideSurface,
  SlideTableCell,
  SlideTableOptions,
  SlideTextOptions,
  SlideTextRun,
} from './export.types'

/**
 * The PDF answer to a page. It draws the very pages the deck draws — same
 * geometry, same type sizes, same order — because both are asked the same four
 * questions by the renderer.
 *
 * Everything the deck writes as text is written as text here too: a PDF made of
 * pictures of a report would hand back nothing to select, search or copy.
 */

/** How a run reads once the box it lands in has been settled. */
interface RunStyle {
  fontSize: number
  bold: boolean
  italic: boolean
  color: string
  /** Extra space between characters, in points */
  charSpacing: number
}

/** One line of a paragraph, at the size it ends up drawn. */
interface TextLine {
  text: string
  style: RunStyle
}

function inches(points: number): number {
  return points / POINTS_PER_INCH
}

/** A colour the export authored for PowerPoint, which reads it without its hash. */
function hex(color: string): string {
  return `#${color.replaceAll('#', '')}`
}

function lineHeight(style: RunStyle, spacing: number): number {
  return inches(style.fontSize) * spacing
}

/**
 * What the standard fonts of a PDF can write: Latin-1, plus the two dozen
 * characters WinAnsi adds over it. Anything else is truncated to a byte on the
 * way out and comes back as another glyph entirely — which is how the narrow
 * no-break space `fr-FR` separates thousands with ends up printed as a slash.
 */
const WIN_ANSI_EXTRAS = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ'
const LATIN_1_LAST_CODE = 0xFF

/** Read as the separators they are, in the only width the fonts have for them. */
const SUBSTITUTES: Record<string, string> = {
  // the spaces of a formatted amount, kept unbreakable as they were written
  '\u202F': '\u00A0', // narrow no-break space — how fr-FR separates thousands
  '\u2009': '\u00A0', // thin space
  '\u2007': '\u00A0', // figure space
  '\u2011': '-', // non-breaking hyphen
  '\u2212': '-', // minus sign
  // the zero-width marks a pasted comment carries, which say nothing on paper
  '\u200B': '',
  '\u200C': '',
  '\u200D': '',
  '\u2060': '',
  '\uFEFF': '',
}

/** Stands in for a character no font of the document has a glyph for. */
const UNKNOWN_CHARACTER = '?'

/**
 * How the type gives way when a block stands taller than the box it was laid
 * out in: by twentieths, and no further than a little over half — past that the
 * box is simply too small for what it was given, and shrinking on would trade
 * an overflow nobody wants for a line nobody can read.
 */
const FIT_STEP = 0.95
const FIT_ATTEMPTS = 12

/** Slack on a height, so that a box measured to the line is not read as short. */
const FIT_TOLERANCE = 0.002

/**
 * The text as the document can carry it. A character it could only mis-draw is
 * marked as missing rather than printed as whatever byte it truncates to: a
 * figure the reader cannot trust is worse than one it can see is incomplete.
 */
function writable(text: string): string {
  return [...text]
    .map(character => {
      const substitute = SUBSTITUTES[character]

      if (substitute !== undefined) {
        return substitute
      }

      if (
        character.codePointAt(0)! <= LATIN_1_LAST_CODE
        || WIN_ANSI_EXTRAS.includes(character)
      ) {
        return character
      }

      return UNKNOWN_CHARACTER
    })
    .join('')
}

class PdfPage implements SlideSurface {
  constructor(private readonly doc: jsPDF) {}

  addShape(_shape: 'rect', options: SlideShapeOptions): void {
    const isFilled = options.fill !== undefined
    const isStroked = options.line !== undefined && options.line.width > 0

    if (isFilled === false && isStroked === false) {
      return
    }

    if (options.fill !== undefined) {
      this.doc.setFillColor(hex(options.fill.color))
    }

    if (options.line !== undefined) {
      this.doc.setDrawColor(hex(options.line.color ?? SLIDE_HEADING_COLOR))
      this.doc.setLineWidth(inches(options.line.width))
    }

    this.doc.rect(
      options.x,
      options.y,
      options.w,
      options.h,
      isFilled ? (isStroked ? 'FD' : 'F') : 'S',
    )
  }

  addImage(options: SlideImageOptions): void {
    this.doc.addImage(options.data, 'PNG', options.x, options.y, options.w, options.h)
  }

  /**
   * Writes a paragraph in the box it was measured for, and only in it. A run
   * too long for its width wraps, and a block still too tall for its box is
   * reduced until it holds: a label that overflowed would be drawn over the
   * figure below it, and a page whose boxes bleed into each other is a page
   * nobody can read.
   */
  addText(text: string | SlideTextRun[], options: SlideTextOptions): void {
    const runs = typeof text === 'string' ? [{ text, options: {} }] : text
    const inset = inches(options.margin ?? 0)
    const width = Math.max(options.w - inset * 2, inches(1))
    const spacing = options.lineSpacingMultiple ?? PDF_LINE_SPACING

    let scale = 1
    let lines = this.readLines(runs, options, width, scale)

    const allowed = this.allowedLines(lines, options.h, spacing)

    for (
      let attempt = 0;
      attempt < FIT_ATTEMPTS
      && (lines.length > allowed || this.blockHeight(lines, spacing) > options.h);
      attempt += 1
    ) {
      scale *= FIT_STEP
      lines = this.readLines(runs, options, width, scale)
    }

    if (lines.length === 0) {
      return
    }

    const height = this.blockHeight(lines, spacing)

    let y = options.valign === 'middle'
      ? options.y + Math.max(0, (options.h - height) / 2)
      : options.y

    lines.forEach(line => {
      this.applyStyle(line.style)

      // Hollow letters: the PDF strokes their contour instead of filling them,
      // which is what makes the ordinal of a section a ghost rather than a
      // figure competing with the ones the page is about.
      if (options.outline !== undefined) {
        this.doc.setDrawColor(hex(options.outline.color))
        this.doc.setLineWidth(inches(options.outline.size))
      }

      const advance = lineHeight(line.style, spacing)

      /**
       * Hung from the middle of its line rather than from the top of it: the
       * leading is then split above and below the letters, which is how a slide
       * places them too. Anchored on the top, a line of 46 points would sit a
       * sixteenth of an inch higher here than in the deck, and the ordinal of a
       * section would stop sharing a line with the title beside it.
       */
      this.doc.text(line.text, this.anchorX(options, inset), y + advance / 2, {
        align: options.align ?? 'left',
        baseline: 'middle',
        renderingMode: options.outline === undefined ? 'fill' : 'stroke',
      })
      y += advance
    })
  }

  /**
   * Draws the cells one by one rather than handing the table over: the widths
   * and the heights were settled by the layout, and a table that reflowed here
   * would stop being the table the page was measured for.
   */
  addTable(rows: SlideTableCell[][], options: SlideTableOptions): void {
    const padding = options.margin ?? 0
    const border = options.border?.type === 'none' ? undefined : options.border
    const strokeWidth = border?.pt ?? 0.5

    let y = options.y

    rows.forEach((row, rowIndex) => {
      const height = options.rowH[rowIndex] ?? 0

      let x = options.x
      let column = 0

      row.forEach(cell => {
        const span = cell.options.colspan ?? 1
        const width = options.colW
          .slice(column, column + span)
          .reduce((total, columnWidth) => total + columnWidth, 0)

        this.addShape('rect', {
          x,
          y,
          w: width,
          h: height,
          fill: cell.options.fill,
          line: border === undefined
            ? undefined
            : { color: border.color, width: strokeWidth },
        })

        this.addText(cell.text, {
          x,
          y,
          w: width,
          h: height,
          margin: padding,
          fontSize: cell.options.fontSize ?? options.fontSize,
          bold: cell.options.bold,
          italic: cell.options.italic,
          color: cell.options.color ?? options.color,
          align: cell.options.align,
          valign: cell.options.valign ?? 'top',
        })

        x += width
        column += span
      })

      y += height
    })
  }

  /** Where a line hangs from, which is the edge its alignment reads against. */
  private anchorX(options: SlideTextOptions, inset: number): number {
    if (options.align === 'right') {
      return options.x + options.w - inset
    }

    if (options.align === 'center') {
      return options.x + options.w / 2
    }

    return options.x + inset
  }

  /** Cuts every run into the lines it takes at the width it was given. */
  private readLines(
    runs: SlideTextRun[],
    options: SlideTextOptions,
    width: number,
    scale: number,
  ): TextLine[] {
    return runs.flatMap(run => {
      const text = writable(run.text)

      if (text.length === 0) {
        return []
      }

      const style: RunStyle = {
        fontSize: (run.options?.fontSize ?? options.fontSize ?? 12) * scale,
        bold: (run.options?.bold ?? options.bold) === true,
        italic: (run.options?.italic ?? options.italic) === true,
        color: run.options?.color ?? options.color ?? SLIDE_HEADING_COLOR,
        // tracking is typography, not a fixed inset: it is reduced with the type
        charSpacing: (run.options?.charSpacing ?? options.charSpacing ?? 0) * scale,
      }

      this.applyStyle(style)

      return this.wrap(text, width, style).map(line => ({ text: line, style }))
    })
  }

  /**
   * Cuts a run into the lines it takes at the width it was given. Written here
   * rather than left to `splitTextToSize`, which measures the text without the
   * character spacing the page then draws it with — an overline so measured
   * runs past the edge of the card carrying it.
   *
   * Only an ordinary space opens a line: an amount separates its thousands with
   * a no-break space, and `1 478 k€` is never cut in two.
   */
  private wrap(text: string, width: number, style: RunStyle): string[] {
    return text
      .split('\n')
      .flatMap(paragraph => this.wrapParagraph(paragraph, width, style))
  }

  private wrapParagraph(paragraph: string, width: number, style: RunStyle): string[] {
    const lines: string[] = []
    let current = ''

    paragraph.split(' ').forEach(word => {
      const candidate = current.length === 0 ? word : `${current} ${word}`

      if (current.length > 0 && this.measure(candidate, style) > width) {
        lines.push(current)
        current = word

        return
      }

      current = candidate
    })

    lines.push(current)

    return lines.flatMap(line => this.breakLongWord(line, width, style))
  }

  /**
   * A word wider than the box it sits in — a label without a space in it — is
   * cut where it stops fitting rather than left to run past the edge.
   */
  private breakLongWord(line: string, width: number, style: RunStyle): string[] {
    if (line.includes(' ') || this.measure(line, style) <= width) {
      return [line]
    }

    const pieces: string[] = []
    let current = ''

    for (const character of line) {
      if (current.length > 0 && this.measure(current + character, style) > width) {
        pieces.push(current)
        current = character
      } else {
        current += character
      }
    }

    pieces.push(current)

    return pieces
  }

  /** Width of a run as the page will draw it, its tracking included. */
  private measure(text: string, style: RunStyle): number {
    return this.doc.getTextWidth(text)
      + inches(style.charSpacing) * Math.max(0, text.length - 1)
  }

  private blockHeight(lines: TextLine[], spacing: number): number {
    return lines.reduce((total, line) => total + lineHeight(line.style, spacing), 0)
  }

  /**
   * How many lines the box was drawn for, read from what holds in it at full
   * size. A footer one line tall gets one line: reducing only until two lines
   * happen to fit would keep the box and lose the reading — the amount and the
   * evolution it is read against belong side by side, as the card draws them.
   */
  private allowedLines(lines: TextLine[], height: number, spacing: number): number {
    let taken = 0
    let count = 0

    for (const line of lines) {
      taken += lineHeight(line.style, spacing)

      if (taken > height + FIT_TOLERANCE) {
        break
      }

      count += 1
    }

    return Math.max(1, count)
  }

  private applyStyle(style: RunStyle): void {
    this.doc.setFont(
      'helvetica',
      style.bold
        ? (style.italic ? 'bolditalic' : 'bold')
        : (style.italic ? 'italic' : 'normal'),
    )
    this.doc.setFontSize(style.fontSize)
    this.doc.setTextColor(hex(style.color))
    this.doc.setCharSpace(inches(style.charSpacing))
  }
}

/** The pages of the report, written as a PDF of the very slides the deck holds. */
export class PdfDeck implements DeckDocument {
  private pageCount = 0

  private constructor(private readonly doc: jsPDF) {}

  /**
   * Imported when the export is asked for rather than with the module: a reader
   * who never exports pays nothing for the ability to.
   */
  static async create(): Promise<PdfDeck> {
    const { jsPDF: PdfConstructor } = await import('jspdf')

    return new PdfDeck(new PdfConstructor({
      orientation: 'landscape',
      unit: 'in',
      format: [SLIDE_WIDTH, SLIDE_HEIGHT],
      compress: true,
    }))
  }

  /** A PDF opens on a page: the first one is the one it already carries. */
  addPage(): SlideSurface {
    if (this.pageCount > 0) {
      this.doc.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], 'landscape')
    }

    this.pageCount += 1

    this.doc.setFillColor(hex(SLIDE_BACKGROUND))
    this.doc.rect(0, 0, SLIDE_WIDTH, SLIDE_HEIGHT, 'F')

    return new PdfPage(this.doc)
  }

  toBlob(): Promise<Blob> {
    return Promise.resolve(this.doc.output('blob'))
  }
}
