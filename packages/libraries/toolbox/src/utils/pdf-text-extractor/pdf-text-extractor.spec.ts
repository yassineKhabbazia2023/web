import { getDocument } from 'pdfjs-dist'
import { PdfTextExtractor } from './pdf-text-extractor'
import { configurePdfWorker } from '../pdf-worker/pdf-worker.utils'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api'

// `pdfjs-dist` is mocked so the heavy real module is never loaded, and the worker util is stubbed
// to a no-op (its real implementation pulls in a `?url` worker asset that cannot resolve in node).
vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
}))

vi.mock('../pdf-worker/pdf-worker.utils', () => ({
  configurePdfWorker: vi.fn(),
}))

const createTextItem = (str: string, x = 0, y = 0, width = 0, height = 0): unknown => ({
  str,
  transform: [1, 0, 0, 1, x, y],
  width,
  height,
})

const createPage = (items: unknown[]): PDFPageProxy =>
  ({
    getTextContent: vi.fn().mockResolvedValue({ items }),
  }) as unknown as PDFPageProxy

const mockLoadedDocument = (document: PDFDocumentProxy): void => {
  vi.mocked(getDocument).mockReturnValue({
    promise: Promise.resolve(document),
  } as unknown as ReturnType<typeof getDocument>)
}

describe('PdfTextExtractor', () => {
  describe('loadDocument', () => {
    it('configures the worker and resolves the loaded document', async () => {
      vi.mocked(configurePdfWorker).mockClear()
      const document = { numPages: 0 } as PDFDocumentProxy
      mockLoadedDocument(document)
      const data = new ArrayBuffer(8)

      const result = await PdfTextExtractor.loadDocument(data)

      expect(configurePdfWorker).toHaveBeenCalledOnce()
      expect(getDocument).toHaveBeenCalledWith({ data })
      expect(result).toBe(document)
    })
  })

  describe('extractPageText', () => {
    it('keeps only items with non-empty text and maps their positions', async () => {
      const page = createPage([
        createTextItem('Hello', 10, 20, 50, 12),
        createTextItem('   ', 5, 5, 5, 12), // whitespace only -> ignored
        createTextItem('', 0, 0, 0, 0), // empty -> ignored
        { type: 'beginMarkedContent' }, // no `str` -> ignored
        createTextItem('World', 60, 20, 55, 12),
      ])

      const result = await PdfTextExtractor.extractPageText(page, 3)

      expect(result).toEqual({
        pageNumber: 3,
        text: 'Hello World',
        items: [
          { text: 'Hello', x: 10, y: 20, page: 3, width: 50, height: 12 },
          { text: 'World', x: 60, y: 20, page: 3, width: 55, height: 12 },
        ],
      })
    })

    it('returns an empty page result when no text items are present', async () => {
      const page = createPage([])

      const result = await PdfTextExtractor.extractPageText(page, 1)

      expect(result).toEqual({ pageNumber: 1, text: '', items: [] })
    })
  })

  describe('extractAllText', () => {
    it('aggregates text and items across every page', async () => {
      const page1 = createPage([createTextItem('Page one', 5, 10, 40, 12)])
      const page2 = createPage([
        createTextItem('Second', 5, 30, 30, 12),
        createTextItem('page', 40, 30, 20, 12),
      ])
      const document = {
        numPages: 2,
        getPage: vi
          .fn()
          .mockImplementation((pageNumber: number) =>
            Promise.resolve(pageNumber === 1 ? page1 : page2),
          ),
      } as unknown as PDFDocumentProxy
      mockLoadedDocument(document)

      const result = await PdfTextExtractor.extractAllText(new ArrayBuffer(8))

      expect(result.pageCount).toBe(2)
      expect(result.fullText).toBe('Page one\n\nSecond page')
      expect(result.pages).toHaveLength(2)
      expect(result.items).toEqual([
        { text: 'Page one', x: 5, y: 10, page: 1, width: 40, height: 12 },
        { text: 'Second', x: 5, y: 30, page: 2, width: 30, height: 12 },
        { text: 'page', x: 40, y: 30, page: 2, width: 20, height: 12 },
      ])
    })
  })
})
