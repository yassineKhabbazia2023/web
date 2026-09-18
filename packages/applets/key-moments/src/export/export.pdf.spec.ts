import { jsPDF } from 'jspdf'
import { PdfDeck } from './export.pdf'
import {
  PDF_LINE_SPACING,
  POINTS_PER_INCH,
  SLIDE_BACKGROUND,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
} from './export.consts'

/**
 * The PDF page is tested on what it asks of jsPDF rather than on the archive it
 * writes: what matters is that a figure is written as text where the layout put
 * it, and that a box is drawn at the very coordinates it was measured for.
 */

interface DrawnRect {
  x: number
  y: number
  w: number
  h: number
  style: string
  fill: string
  draw: string
  lineWidth: number
}

interface DrawnText {
  text: string
  x: number
  y: number
  align?: string
  renderingMode?: string
  fontSize: number
  font: string
  color: string
  charSpace: number
}

/** Every character the same width, so that wrapping can be asserted without a font. */
const CHARACTER_WIDTH_RATIO = 0.5

const PDF_BLOB = new Blob(['pdf'])

function fakeDocument() {
  const state = {
    fill: '',
    draw: '',
    lineWidth: 0,
    fontSize: 0,
    font: '',
    color: '',
    charSpace: 0,
  }

  const rects: DrawnRect[] = []
  const texts: DrawnText[] = []
  const images: { data: string, x: number, y: number, w: number, h: number }[] = []
  const pages: (number[] | undefined)[] = []

  return {
    rects,
    texts,
    images,
    pages,
    setFillColor: (color: string) => {
      state.fill = color
    },
    setDrawColor: (color: string) => {
      state.draw = color
    },
    setLineWidth: (width: number) => {
      state.lineWidth = width
    },
    setFont: (_family: string, style: string) => {
      state.font = style
    },
    setFontSize: (size: number) => {
      state.fontSize = size
    },
    setTextColor: (color: string) => {
      state.color = color
    },
    setCharSpace: (space: number) => {
      state.charSpace = space
    },
    rect: (x: number, y: number, w: number, h: number, style: string) => {
      rects.push({ x, y, w, h, style, ...state })
    },
    text: (
      text: string,
      x: number,
      y: number,
      options: { align?: string, renderingMode?: string },
    ) => {
      texts.push({ text, x, y, align: options.align, renderingMode: options.renderingMode, ...state })
    },
    addImage: (data: string, _format: string, x: number, y: number, w: number, h: number) => {
      images.push({ data, x, y, w, h })
    },
    getTextWidth: (text: string) =>
      text.length * state.fontSize * CHARACTER_WIDTH_RATIO / POINTS_PER_INCH,
    addPage: (format: number[]) => pages.push(format),
    output: () => PDF_BLOB,
  }
}

let doc: ReturnType<typeof fakeDocument>

/**
 * The deck builds its document with `new`, and the mocked constructor hands
 * back an instance of its own prototype: that is where the recorder is
 * installed, as the deck spec installs its own.
 */
beforeEach(() => {
  doc = fakeDocument()

  Object.assign(vi.mocked(jsPDF).prototype, doc)
})

/** Height of a line of that type size, in inches — what the page advances by. */
function lineHeight(fontSize: number): number {
  return fontSize / POINTS_PER_INCH * PDF_LINE_SPACING
}

/**
 * Where a line drawn at the top of its box is recorded. The page hangs a line
 * from its middle — the leading is split above and below the letters, as a
 * slide splits it — so the middle of the first line is what jsPDF is given.
 */
function middleOfLine(top: number, fontSize: number): number {
  return top + lineHeight(fontSize) / 2
}

describe('PdfDeck', () => {
  it('should open on the page it already carries, and paint it', async () => {
    const deck = await PdfDeck.create()

    deck.addPage()

    expect(doc.pages).toEqual([])
    expect(doc.rects).toEqual([expect.objectContaining({
      x: 0,
      y: 0,
      w: SLIDE_WIDTH,
      h: SLIDE_HEIGHT,
      style: 'F',
      fill: `#${SLIDE_BACKGROUND}`,
    })])
  })

  it('should add a page of the very size of a slide for every page after it', async () => {
    const deck = await PdfDeck.create()

    deck.addPage()
    deck.addPage()
    deck.addPage()

    expect(doc.pages).toEqual([[SLIDE_WIDTH, SLIDE_HEIGHT], [SLIDE_WIDTH, SLIDE_HEIGHT]])
  })

  it('should hand the written file over', async () => {
    const deck = await PdfDeck.create()

    await expect(deck.toBlob()).resolves.toBe(PDF_BLOB)
  })
})

describe('PdfPage.addShape', () => {
  it('should fill and stroke a box exactly where it was placed', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addShape('rect', {
      x: 1,
      y: 2,
      w: 3,
      h: 0.5,
      fill: { color: 'FFFFFF' },
      line: { color: 'E6E7F0', width: 0.5 },
    })

    expect(doc.rects.at(-1)).toEqual(expect.objectContaining({
      x: 1,
      y: 2,
      w: 3,
      h: 0.5,
      style: 'FD',
      fill: '#FFFFFF',
      draw: '#E6E7F0',
      lineWidth: 0.5 / POINTS_PER_INCH,
    }))
  })

  it('should only fill a box drawn without an outline', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addShape('rect', { x: 0, y: 0, w: 1, h: 1, fill: { color: '1AAB8E' }, line: { width: 0 } })

    expect(doc.rects.at(-1)?.style).toBe('F')
  })

  /** A shape asking for neither is a shape nothing would be seen of. */
  it('should draw nothing when neither a fill nor an outline is asked for', async () => {
    const page = (await PdfDeck.create()).addPage()
    const drawn = doc.rects.length

    page.addShape('rect', { x: 0, y: 0, w: 1, h: 1 })

    expect(doc.rects).toHaveLength(drawn)
  })
})

describe('PdfPage.addText', () => {
  it('should write a line at the top left of its box, in the type it was given', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Trésorerie', {
      x: 1,
      y: 2,
      w: 4,
      h: 0.3,
      fontSize: 12,
      bold: true,
      color: '0E0F30',
    })

    expect(doc.texts).toEqual([expect.objectContaining({
      text: 'Trésorerie',
      x: 1,
      y: middleOfLine(2, 12),
      align: 'left',
      fontSize: 12,
      font: 'bold',
      color: '#0E0F30',
    })])
  })

  it('should hang a right-aligned line off the right edge of its box', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('2/3', { x: 1, y: 2, w: 4, h: 0.3, fontSize: 9, align: 'right' })

    expect(doc.texts.at(-1)).toEqual(expect.objectContaining({ x: 5, align: 'right' }))
  })

  /** A run is a line of its own: that is how a two-line header is written. */
  it('should write every run under the previous one', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText(
      [
        { text: 'Évolution', options: { breakLine: true } },
        { text: 'vs N-1', options: { fontSize: 6 } },
      ],
      { x: 0, y: 1, w: 4, h: 0.5, fontSize: 8 },
    )

    expect(doc.texts.map(({ text, y, fontSize }) => ({ text, y, fontSize }))).toEqual([
      { text: 'Évolution', y: middleOfLine(1, 8), fontSize: 8 },
      { text: 'vs N-1', y: middleOfLine(1 + lineHeight(8), 6), fontSize: 6 },
    ])
  })

  it('should wrap a line too long for the width it was given, on its spaces', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Amortissements et provisions', { x: 0, y: 0, w: 1.1, h: 0.5, fontSize: 9 })

    expect(doc.texts.map(({ text }) => text)).toEqual(['Amortissements et', 'provisions'])
  })

  /**
   * The tracking of an overline is drawn but was not measured, which is how a
   * card title used to run past the edge of the card carrying it.
   */
  it('should count the character spacing when wrapping', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('EFFET EVOL DU TAUX', { x: 0, y: 0, w: 0.72, h: 0.5, fontSize: 7, charSpacing: 1 })

    const widest = Math.max(...doc.texts.map(({ text, fontSize, charSpace }) =>
      text.length * fontSize * CHARACTER_WIDTH_RATIO / POINTS_PER_INCH + charSpace * (text.length - 1)))

    expect(doc.texts.length).toBeGreaterThan(1)
    expect(widest).toBeLessThanOrEqual(0.72)
  })

  /** An amount separates its thousands with a no-break space, and holds together. */
  it('should never cut an amount on its thousands separator', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Total 1\u00A0478\u00A0k\u20AC', { x: 0, y: 0, w: 0.6, h: 0.6, fontSize: 8 })

    expect(doc.texts.map(({ text }) => text)).toEqual(['Total', '1\u00A0478\u00A0k\u20AC'])
  })

  it('should cut a word wider than its box, having nowhere else to break it', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Amortissements', { x: 0, y: 0, w: 0.3, h: 0.6, fontSize: 8 })

    expect(doc.texts.map(({ text }) => text).join('')).toBe('Amortissements')
    expect(doc.texts.length).toBeGreaterThan(1)
  })

  /**
   * Nothing is asked for: a label that overflowed would be drawn over the
   * figure below it, so the type gives way on every box.
   */
  it('should reduce a block that wraps past the height of its box', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Seuil de rentabilité de exploitation', { x: 0, y: 0, w: 1, h: 0.16, fontSize: 7 })

    const written = doc.texts.map(({ text }) => text).join(' ')
    const bottom = doc.texts.at(-1)!.y
      + doc.texts.at(-1)!.fontSize / POINTS_PER_INCH * PDF_LINE_SPACING / 2

    expect(written).toBe('Seuil de rentabilité de exploitation')
    expect(doc.texts[0].fontSize).toBeLessThan(7)
    expect(bottom).toBeLessThanOrEqual(0.16)
  })

  it('should centre a block asked to sit in the middle of its box', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Commentaire', { x: 0, y: 0, w: 4, h: 1, fontSize: 9, valign: 'middle' })

    // One line centred in its box is one line drawn through the middle of it
    expect(doc.texts[0].y).toBeCloseTo(0.5)
  })

  /** Nothing the firm wrote is dropped: the type gives way, never the words. */
  it('should reduce a note rather than overflow the box it was written in', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Une note bien plus longue que la case', {
      x: 0,
      y: 0,
      w: 1,
      h: 0.2,
      fontSize: 10,
    })

    const written = doc.texts.map(({ text }) => text).join(' ')

    expect(written).toBe('Une note bien plus longue que la case')
    expect(doc.texts.at(-1)!.y + lineHeight(doc.texts.at(-1)!.fontSize) / 2).toBeLessThanOrEqual(0.2)
  })

  /** The ordinal of a section numbers without being read: it is drawn hollow. */
  it('should stroke the letters of a text asked for as an outline', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('01', {
      x: 0,
      y: 0,
      w: 1,
      h: 0.5,
      fontSize: 46,
      bold: true,
      outline: { color: 'D9DAEE', size: 0.9 },
    })

    expect(doc.texts[0]).toEqual(expect.objectContaining({
      text: '01',
      renderingMode: 'stroke',
      draw: '#D9DAEE',
      lineWidth: 0.9 / POINTS_PER_INCH,
    }))
  })

  it('should fill the letters of every other text', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Santé financière', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 18 })

    expect(doc.texts[0].renderingMode).toBe('fill')
  })

  it('should write nothing at all for an empty text', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 9 })

    expect(doc.texts).toEqual([])
  })

  /**
   * The standard fonts of a PDF hold Latin-1 and no more: the narrow no-break
   * space `fr-FR` separates thousands with used to come out as a slash.
   */
  it('should write the thousands separator of an amount as a space', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('1\u202F478\u00A0k\u20AC', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 12 })

    expect(doc.texts[0].text).toBe('1\u00A0478\u00A0k\u20AC')
  })

  it('should write a minus sign as the hyphen the fonts hold', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('\u22123,1\u202F%', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 12 })

    expect(doc.texts[0].text).toBe('-3,1\u00A0%')
  })

  it('should drop a zero-width mark a pasted note carries', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Marge\u200B brute', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 12 })

    expect(doc.texts[0].text).toBe('Marge brute')
  })

  /** Better a reader who sees a hole than one who reads another character. */
  it('should mark a character no font of the document can draw', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Objectif \u2192 atteint', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 12 })

    expect(doc.texts[0].text).toBe('Objectif ? atteint')
  })

  it('should keep the accents and the currency the fonts do hold', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('Résultat : 84\u202F500\u00A0€ — clôturé', { x: 0, y: 0, w: 9, h: 0.3, fontSize: 12 })

    expect(doc.texts[0].text).toBe('Résultat : 84\u00A0500\u00A0€ — clôturé')
  })

  it('should space the characters of an overline as the deck spaces them', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addText('SANTÉ FINANCIÈRE', { x: 0, y: 0, w: 4, h: 0.3, fontSize: 11, charSpacing: 2 })

    expect(doc.texts[0].charSpace).toBe(2 / POINTS_PER_INCH)
  })
})

describe('PdfPage.addTable', () => {
  const ROWS = [
    [
      { text: 'INDICATEUR', options: { align: 'left' as const, fill: { color: '0E0F30' } } },
      { text: 'N', options: { align: 'right' as const } },
    ],
    [
      { text: 'CA', options: { align: 'left' as const } },
      { text: '1 240 000', options: { align: 'right' as const } },
    ],
  ]

  const OPTIONS = {
    x: 1,
    y: 2,
    w: 3,
    colW: [2, 1],
    rowH: [0.4, 0.25],
    fontSize: 9,
    color: '0E0F30',
    border: { type: 'solid' as const, pt: 0.5, color: 'E6E7F0' },
    margin: 2,
  }

  it('should draw every cell at the width and the height the layout settled', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addTable(ROWS, OPTIONS)

    // The page itself was painted first
    expect(doc.rects.slice(1).map(({ x, y, w, h }) => ({ x, y, w, h }))).toEqual([
      { x: 1, y: 2, w: 2, h: 0.4 },
      { x: 3, y: 2, w: 1, h: 0.4 },
      { x: 1, y: 2.4, w: 2, h: 0.25 },
      { x: 3, y: 2.4, w: 1, h: 0.25 },
    ])
  })

  it('should write the figures of a cell as text, inset from its edges', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addTable(ROWS, OPTIONS)

    const [, , , figure] = doc.texts

    expect(figure).toEqual(expect.objectContaining({
      text: '1 240 000',
      align: 'right',
      // The right edge of its column, less the inset of the cell
      x: 4 - 2 / POINTS_PER_INCH,
    }))
  })

  it('should give a cell spanning two columns the width of both', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addTable(
      [[{ text: 'Au départ', options: { align: 'left' as const, colspan: 2 } }]],
      OPTIONS,
    )

    expect(doc.rects.at(-1)).toEqual(expect.objectContaining({ x: 1, w: 3 }))
  })

  it('should leave a borderless table unstroked', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addTable(
      [[{ text: 'Au départ', options: { colspan: 2 } }]],
      { ...OPTIONS, border: { type: 'none' as const } },
    )

    expect(doc.rects).toHaveLength(1)
  })
})

describe('PdfPage.addImage', () => {
  it('should place a drawing where it was fitted', async () => {
    const page = (await PdfDeck.create()).addPage()

    page.addImage({ data: 'data:image/png;base64,chart', x: 1, y: 2, w: 3, h: 1.8 })

    expect(doc.images).toEqual([{ data: 'data:image/png;base64,chart', x: 1, y: 2, w: 3, h: 1.8 }])
  })
})
