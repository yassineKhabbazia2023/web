import type { OfferDescription } from '../../types/offers-catalog.types'
import type { PDocumentDisplayProps } from '@pulse/styleguide/types'

export interface CatalogDocumentViewerProps {
  isOpened: boolean
  offer: OfferDescription
  offerPdf: PDocumentDisplayProps['pSrc']
}
