import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from './pennylane-terms-viewer.types'

/**
 * Manager for handling PDF operations without Vue dependency
 * Contains pure business logic for loading, rendering and scroll detection
 */
export class PennylaneTermsViewerManager {
  /**
   * Loads a PDF document from binary data
   * @param pdfData - Raw PDF data (ArrayBuffer | Uint8Array)
   * @returns Loaded PDF document
   */
  static async loadPdfDocument(
    pdfData: ArrayBuffer | Uint8Array,
  ): Promise<PDFDocumentProxy> {
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    return await loadingTask.promise
  }

  /**
   * Retrieves all pages from a PDF document
   * @param pdfDocument - PDF document
   * @returns Array of PDF pages
   */
  static async getAllPages(
    pdfDocument: PDFDocumentProxy,
  ): Promise<PDFPageProxy[]> {
    const pagePromises: Promise<PDFPageProxy>[] = []
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      pagePromises.push(pdfDocument.getPage(i))
    }
    return await Promise.all(pagePromises)
  }

  /**
   * Calculates optimal scale for rendering a PDF page
   * @param page - PDF page to render
   * @param containerWidth - Container width
   * @param padding - Total padding (left + right), defaults to 32px
   * @returns Calculated scale
   */
  static calculateOptimalScale(
    page: PDFPageProxy,
    containerWidth: number,
    padding: number = 32,
  ): number {
    const viewport = page.getViewport({ scale: 1 })
    const availableWidth = containerWidth - padding
    return availableWidth / viewport.width
  }

  /**
   * Renders a PDF page on a canvas
   * @param page - PDF page to render
   * @param canvas - Target HTML canvas
   * @param scale - Render scale
   * @returns Render task
   */
  static renderPageToCanvas(
    page: PDFPageProxy,
    canvas: HTMLCanvasElement,
    scale: number,
  ): RenderTask {
    const viewport = page.getViewport({ scale })
    const context = canvas.getContext('2d')

    if (context === null) {
      throw new Error('Cannot get 2D context from canvas')
    }

    canvas.height = viewport.height
    canvas.width = viewport.width

    return page.render({
      canvasContext: context,
      viewport,
      canvas,
    })
  }

  /**
   * Checks if scroll has reached the bottom of the container
   * @param scrollTop - Current scroll position
   * @param scrollHeight - Total scrollable height
   * @param clientHeight - Visible container height
   * @param threshold - Threshold in pixels (defaults to 10px)
   * @returns true if at the bottom of the container
   */
  static isScrolledToBottom(
    scrollTop: number,
    scrollHeight: number,
    clientHeight: number,
    threshold: number = 10,
  ): boolean {
    return scrollTop + clientHeight >= scrollHeight - threshold
  }
}
