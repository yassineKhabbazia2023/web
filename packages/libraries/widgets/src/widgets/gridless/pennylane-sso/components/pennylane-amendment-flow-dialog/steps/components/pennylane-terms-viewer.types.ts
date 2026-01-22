import type { PDFDocumentProxy, PDFPageProxy, RenderTask } from 'pdfjs-dist'

export interface PennylaneTermsViewerProps {
  accountId: number
}

export const ZOOM_STEP = 0.25
export const MIN_ZOOM = 0.25
export const MAX_ZOOM = 3
export const MOBILE_SCALE = 0.6
export const DEFAULT_CONTAINER_WIDTH = 733

export type { PDFDocumentProxy, PDFPageProxy, RenderTask }
