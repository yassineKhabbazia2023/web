/**
 * Represents a single extracted text item with position information
 */
export interface ExtractedTextItem {
  text: string
  x: number
  y: number
  page: number
  width: number
  height: number
}

/**
 * Represents text content extracted from a single page
 */
export interface ExtractedPageText {
  pageNumber: number
  text: string
  items: ExtractedTextItem[]
}

/**
 * Complete result of text extraction from a PDF document
 */
export interface ExtractedTextResult {
  fullText: string
  pages: ExtractedPageText[]
  items: ExtractedTextItem[]
  pageCount: number
}
