import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist/types/src/display/api'
import type { ExtractedTextItem, ExtractedPageText, ExtractedTextResult } from './pdf-text-extractor.type'

export type { ExtractedTextItem, ExtractedPageText, ExtractedTextResult } from './pdf-text-extractor.type'

/**
 * Utility class for extracting text from PDF documents using PDF.js
 * Contains pure business logic without Vue dependency
 */
export class PdfTextExtractor {
  /**
   * Loads a PDF document from binary data
   * @param data - Raw PDF data as ArrayBuffer
   * @returns Loaded PDF document proxy
   */
  static async loadDocument(data: ArrayBuffer): Promise<PDFDocumentProxy> {
    const loadingTask = pdfjsLib.getDocument({ data })
    return await loadingTask.promise
  }

  /**
   * Extracts text content from a single PDF page
   * @param page - PDF page proxy
   * @param pageNumber - Page number for position tracking
   * @returns Extracted text content with item positions
   */
  static async extractPageText(page: PDFPageProxy, pageNumber: number): Promise<ExtractedPageText> {
    const textContent = await page.getTextContent()
    const items: ExtractedTextItem[] = []
    const textParts: string[] = []

    for (const item of textContent.items) {
      if ('str' in item) {
        const text = item.str

        if (text.trim()) {
          items.push({
            text,
            x: item.transform[4],
            y: item.transform[5],
            page: pageNumber,
            width: item.width,
            height: item.height,
          })
          textParts.push(text)
        }
      }
    }

    return {
      pageNumber,
      text: textParts.join(' '),
      items,
    }
  }

  /**
   * Extracts all text content from a PDF document
   * @param pdfData - Raw PDF data as ArrayBuffer
   * @returns Complete extraction result with full text and page-by-page data
   */
  static async extractAllText(pdfData: ArrayBuffer): Promise<ExtractedTextResult> {
    const document = await this.loadDocument(pdfData)
    const pages: ExtractedPageText[] = []
    const allItems: ExtractedTextItem[] = []
    const pageTexts: string[] = []

    for (let i = 1; i <= document.numPages; i++) {
      const page = await document.getPage(i)
      const pageText = await this.extractPageText(page, i)
      pages.push(pageText)
      allItems.push(...pageText.items)
      pageTexts.push(pageText.text)
    }

    return {
      fullText: pageTexts.join('\n\n'),
      pages,
      items: allItems,
      pageCount: document.numPages,
    }
  }
}
