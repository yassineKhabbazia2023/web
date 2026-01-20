import type { PDFDocumentProxy, PDFPageProxy } from './pennylane-terms-viewer.types'
import * as pdfjsLib from 'pdfjs-dist'

vi.mock('pdfjs-dist', () => ({
  getDocument: vi.fn(),
}))

const { PennylaneTermsViewerManager } = await import('./pennylane-terms-viewer.manager')

describe('PennylaneTermsViewerManager', () => {
  describe('loadPdfDocument', () => {
    it('should load PDF document from binary data', async () => {
      const mockPdfDocument = { numPages: 3 }
      const mockLoadingTask = { promise: Promise.resolve(mockPdfDocument) }
      vi.mocked(pdfjsLib.getDocument).mockReturnValue(mockLoadingTask as any)

      const pdfData = new Uint8Array([1, 2, 3, 4, 5])
      const result = await PennylaneTermsViewerManager.loadPdfDocument(pdfData)

      expect(pdfjsLib.getDocument).toHaveBeenCalledWith({ data: pdfData })
      expect(result).toBe(mockPdfDocument)
    })

    it('should handle ArrayBuffer input', async () => {
      const mockPdfDocument = { numPages: 5 }
      const mockLoadingTask = { promise: Promise.resolve(mockPdfDocument) }
      vi.mocked(pdfjsLib.getDocument).mockReturnValue(mockLoadingTask as any)

      const pdfData = new ArrayBuffer(10)
      const result = await PennylaneTermsViewerManager.loadPdfDocument(pdfData)

      expect(pdfjsLib.getDocument).toHaveBeenCalledWith({ data: pdfData })
      expect(result).toBe(mockPdfDocument)
    })
  })

  describe('getAllPages', () => {
    it('should retrieve all pages from PDF document', async () => {
      const mockPage1 = { pageNumber: 1 }
      const mockPage2 = { pageNumber: 2 }
      const mockPage3 = { pageNumber: 3 }
      const mockPdfDocument = {
        numPages: 3,
        getPage: vi.fn()
          .mockResolvedValueOnce(mockPage1)
          .mockResolvedValueOnce(mockPage2)
          .mockResolvedValueOnce(mockPage3),
      } as unknown as PDFDocumentProxy

      const result = await PennylaneTermsViewerManager.getAllPages(mockPdfDocument)

      expect(mockPdfDocument.getPage).toHaveBeenCalledTimes(3)
      expect(mockPdfDocument.getPage).toHaveBeenNthCalledWith(1, 1)
      expect(mockPdfDocument.getPage).toHaveBeenNthCalledWith(2, 2)
      expect(mockPdfDocument.getPage).toHaveBeenNthCalledWith(3, 3)
      expect(result).toEqual([mockPage1, mockPage2, mockPage3])
    })

    it('should return empty array for document with no pages', async () => {
      const mockPdfDocument = {
        numPages: 0,
        getPage: vi.fn(),
      } as unknown as PDFDocumentProxy

      const result = await PennylaneTermsViewerManager.getAllPages(mockPdfDocument)

      expect(mockPdfDocument.getPage).not.toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('should handle single page document', async () => {
      const mockPage = { pageNumber: 1 }
      const mockPdfDocument = {
        numPages: 1,
        getPage: vi.fn().mockResolvedValue(mockPage),
      } as unknown as PDFDocumentProxy

      const result = await PennylaneTermsViewerManager.getAllPages(mockPdfDocument)

      expect(mockPdfDocument.getPage).toHaveBeenCalledTimes(1)
      expect(mockPdfDocument.getPage).toHaveBeenCalledWith(1)
      expect(result).toEqual([mockPage])
    })
  })

  describe('calculateOptimalScale', () => {
    it('should calculate correct scale for given container width', () => {
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
      } as unknown as PDFPageProxy

      const scale = PennylaneTermsViewerManager.calculateOptimalScale(mockPage, 733, 32)

      expect(mockPage.getViewport).toHaveBeenCalledWith({ scale: 1 })
      expect(scale).toBeCloseTo((733 - 32) / 600)
    })

    it('should use default padding if not provided', () => {
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
      } as unknown as PDFPageProxy

      const scale = PennylaneTermsViewerManager.calculateOptimalScale(mockPage, 733)

      expect(scale).toBeCloseTo((733 - 32) / 600)
    })

    it('should return correct scale when page is wider than container', () => {
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 800, height: 600 }),
      } as unknown as PDFPageProxy

      const scale = PennylaneTermsViewerManager.calculateOptimalScale(mockPage, 500, 20)

      expect(scale).toBeCloseTo((500 - 20) / 800)
    })
  })

  describe('isScrolledToBottom', () => {
    it('should return true when scrolled to bottom', () => {
      const result = PennylaneTermsViewerManager.isScrolledToBottom(100, 150, 50, 10)
      expect(result).toBe(true)
    })

    it('should return true when within threshold', () => {
      const result = PennylaneTermsViewerManager.isScrolledToBottom(95, 150, 50, 10)
      expect(result).toBe(true)
    })

    it('should return false when not at bottom', () => {
      const result = PennylaneTermsViewerManager.isScrolledToBottom(80, 150, 50, 10)
      expect(result).toBe(false)
    })

    it('should use default threshold of 10 if not provided', () => {
      // 85 + 50 = 135 which is less than 150 - 10 = 140
      const result = PennylaneTermsViewerManager.isScrolledToBottom(85, 150, 50)
      expect(result).toBe(false)
    })

    it('should return true when exactly at bottom', () => {
      const result = PennylaneTermsViewerManager.isScrolledToBottom(100, 150, 50, 0)
      expect(result).toBe(true)
    })
  })

  describe('renderPageToCanvas', () => {
    it('should throw error if canvas context is null', () => {
      const mockPage = {
        getViewport: vi.fn().mockReturnValue({ width: 600, height: 800 }),
        render: vi.fn(),
      } as unknown as PDFPageProxy

      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as HTMLCanvasElement

      expect(() => {
        PennylaneTermsViewerManager.renderPageToCanvas(mockPage, mockCanvas, 1.5)
      }).toThrow('Cannot get 2D context from canvas')
    })

    it('should set canvas dimensions and call page.render', () => {
      const mockRenderTask = { promise: Promise.resolve() }
      const mockContext = {}
      // Mock returns scaled values (600 * 1.5 = 900, 800 * 1.5 = 1200)
      const mockViewport = { width: 900, height: 1200 }
      const mockPage = {
        getViewport: vi.fn().mockReturnValue(mockViewport),
        render: vi.fn().mockReturnValue(mockRenderTask),
      } as unknown as PDFPageProxy

      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(mockContext),
        height: 0,
        width: 0,
      } as unknown as HTMLCanvasElement

      const renderTask = PennylaneTermsViewerManager.renderPageToCanvas(mockPage, mockCanvas, 1.5)

      expect(mockPage.getViewport).toHaveBeenCalledWith({ scale: 1.5 })
      expect(mockCanvas.height).toBe(1200)
      expect(mockCanvas.width).toBe(900)
      expect(mockPage.render).toHaveBeenCalled()
      expect(renderTask).toBe(mockRenderTask)
    })

    it('should calculate viewport with correct scale', () => {
      const mockContext = {}
      const mockRenderTask = { promise: Promise.resolve() }
      // Mock returns scaled values (400 * 2.0 = 800, 600 * 2.0 = 1200)
      const mockViewport = { width: 800, height: 1200 }
      const mockPage = {
        getViewport: vi.fn().mockReturnValue(mockViewport),
        render: vi.fn().mockReturnValue(mockRenderTask),
      } as unknown as PDFPageProxy

      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(mockContext),
        height: 0,
        width: 0,
      } as unknown as HTMLCanvasElement

      PennylaneTermsViewerManager.renderPageToCanvas(mockPage, mockCanvas, 2.0)

      expect(mockPage.getViewport).toHaveBeenCalledWith({ scale: 2.0 })
      expect(mockCanvas.height).toBe(1200)
      expect(mockCanvas.width).toBe(800)
    })
  })
})
