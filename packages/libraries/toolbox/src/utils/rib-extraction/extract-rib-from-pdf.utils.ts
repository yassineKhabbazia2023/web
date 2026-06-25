import { PdfTextExtractor } from '../pdf-text-extractor'
import { RibExtractionService } from './rib-extraction.service'
import type { RibExtractionResult } from './rib-extraction.type'

/**
 * Client-side pseudo-OCR: reads a PDF "RIB" file, extracts its raw text with
 * PDF.js, then derives the banking data (IBAN, BIC, RIB components) from it.
 * Consumers never have to deal with the PDF.js worker setup.
 */
export const extractRibFromPdf = async (file: File): Promise<RibExtractionResult> => {
  const buffer = await file.arrayBuffer()
  const { fullText } = await PdfTextExtractor.extractAllText(buffer)
  return RibExtractionService.extract(fullText)
}
