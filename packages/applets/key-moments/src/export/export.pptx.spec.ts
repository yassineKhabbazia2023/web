import PptxGenJS from 'pptxgenjs'
import { PptxDeck } from './export.pptx'
import { SLIDE_BACKGROUND, SLIDE_FONT_FACE } from './export.consts'

/**
 * The deck is tested on what it asks of PptxGenJS rather than on the archive it
 * writes: what matters is that a slide is opened on the canvas of the report,
 * and that the two documents are handed the same face and the same rule about
 * a block too tall for its box.
 */

const DECK_BLOB = new Blob(['deck'])

function fakeSlide() {
  const texts: { text: unknown, options: Record<string, unknown> }[] = []

  return {
    texts,
    background: undefined as { color: string } | undefined,
    addText: (text: unknown, options: Record<string, unknown>) => texts.push({ text, options }),
    addShape: vi.fn(),
    addTable: vi.fn(),
    addImage: vi.fn(),
  }
}

let slide: ReturnType<typeof fakeSlide>

/**
 * The deck builds its presentation with `new`, and the mocked constructor hands
 * back an instance of its own prototype: that is where the recorder is
 * installed, as the manager spec installs its own.
 */
beforeEach(() => {
  slide = fakeSlide()

  Object.assign(vi.mocked(PptxGenJS).prototype, {
    addSlide: () => slide,
    write: () => Promise.resolve(DECK_BLOB),
  })
})

/** The presentation the deck built, which is the one the constructor returned. */
function presentation(): Record<string, unknown> {
  return vi.mocked(PptxGenJS).mock.instances[0] as unknown as Record<string, unknown>
}

describe('PptxDeck', () => {
  it('should open a presentation on the canvas of the report', async () => {
    await PptxDeck.create()

    expect(presentation().layout).toBe('LAYOUT_16x9')
  })

  /**
   * Left to the theme, the deck would be written in the Calibri of Office —
   * narrower than the Helvetica a PDF holds, and the two documents would stop
   * breaking their lines on the same word.
   */
  it('should write the deck in the very face the PDF is written in', async () => {
    await PptxDeck.create()

    expect(presentation().theme).toEqual({
      headFontFace: SLIDE_FONT_FACE,
      bodyFontFace: SLIDE_FONT_FACE,
    })
  })

  it('should paint every page it opens', async () => {
    const deck = await PptxDeck.create()

    deck.addPage()

    expect(slide.background).toEqual({ color: SLIDE_BACKGROUND })
  })

  it('should hand the written file over', async () => {
    const deck = await PptxDeck.create()

    await expect(deck.toBlob()).resolves.toBe(DECK_BLOB)
  })
})

describe('PptxDeck.addPage — the text boxes', () => {
  /**
   * PowerPoint lets a box overflow where the PDF reduces the type: asked for on
   * every box, so that a note too long for its slot reads the same in both.
   */
  it('should ask every text box to reduce rather than overflow', async () => {
    const page = (await PptxDeck.create()).addPage()

    page.addText('Une note bien plus longue que la case', {
      x: 0,
      y: 1,
      w: 2,
      h: 0.2,
      fontSize: 9,
    })

    expect(slide.texts).toEqual([{
      text: 'Une note bien plus longue que la case',
      options: { x: 0, y: 1, w: 2, h: 0.2, fontSize: 9, fit: 'shrink' },
    }])
  })

  it('should leave everything else of a box as it was measured', async () => {
    const page = (await PptxDeck.create()).addPage()

    page.addText('01', {
      x: 0.5,
      y: 0.4,
      w: 0.82,
      h: 0.77,
      fontSize: 46,
      bold: true,
      valign: 'middle',
      outline: { color: 'D9DAEE', size: 0.9 },
    })

    expect(slide.texts[0].options).toEqual(expect.objectContaining({
      x: 0.5,
      w: 0.82,
      bold: true,
      valign: 'middle',
      outline: { color: 'D9DAEE', size: 0.9 },
    }))
  })

  it('should write the runs of a rich paragraph as they were authored', async () => {
    const page = (await PptxDeck.create()).addPage()

    const runs = [
      { text: 'Évolution', options: { breakLine: true } },
      { text: 'vs N-1', options: { fontSize: 6 } },
    ]

    page.addText(runs, { x: 0, y: 0, w: 1, h: 0.3, fontSize: 8 })

    expect(slide.texts[0].text).toBe(runs)
  })
})
