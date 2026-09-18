import { SLIDE_BACKGROUND, SLIDE_FONT_FACE } from './export.consts'
import type PptxGenJS from 'pptxgenjs'
import type {
  DeckDocument,
  SlideSurface,
  SlideTextOptions,
  SlideTextRun,
} from './export.types'

/**
 * The PowerPoint answer to a page: a slide already draws everything the export
 * asks for, so almost nothing is adapted here beyond opening it on the canvas
 * of the report and handing back the written archive.
 */
export class PptxDeck implements DeckDocument {
  private constructor(private readonly deck: PptxGenJS) {}

  /**
   * Imported when the export is asked for rather than with the module: a reader
   * who never exports pays nothing for the ability to.
   */
  static async create(): Promise<PptxDeck> {
    const { default: PptxGenJSConstructor } = await import('pptxgenjs')

    const deck = new PptxGenJSConstructor()
    deck.layout = 'LAYOUT_16x9'

    /**
     * Stated rather than left to the theme, which would hand the deck the
     * Calibri of Office — narrower than what the PDF draws, and a deck that
     * broke its lines on other words than the PDF is no longer the same pages.
     */
    deck.theme = { headFontFace: SLIDE_FONT_FACE, bodyFontFace: SLIDE_FONT_FACE }

    return new PptxDeck(deck)
  }

  addPage(): SlideSurface {
    const slide = this.deck.addSlide()
    slide.background = { color: SLIDE_BACKGROUND }

    return {
      addShape: slide.addShape.bind(slide),
      addTable: slide.addTable.bind(slide),
      addImage: slide.addImage.bind(slide),

      /**
       * PowerPoint lets a text box overflow, where the PDF reduces the type
       * until the block holds. Asked for on every box, so that a note too long
       * for its slot reads the same in both documents rather than being drawn
       * over the figure below it in one of them.
       */
      addText: (text: string | SlideTextRun[], options: SlideTextOptions) => {
        slide.addText(text, { ...options, fit: 'shrink' })
      },
    }
  }

  async toBlob(): Promise<Blob> {
    return await this.deck.write({ outputType: 'blob' }) as Blob
  }
}
