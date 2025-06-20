import type { OfferDescription } from '../../types/offers-catalog.types'
import type { PDocumentDisplayProps } from '@pulse/styleguide/types'
import { APICallStatus } from '@pulse/common/enums'

export interface CatalogDrawerContentPdfProps {
  offer: OfferDescription
  offerPdf: PDocumentDisplayProps['pSrc']
  apiCallStatus: APICallStatus
}
