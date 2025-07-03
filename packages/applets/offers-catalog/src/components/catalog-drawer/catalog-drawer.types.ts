import type { OfferDescription, OfferCatalogReferent, OfferCatalogDocument } from '../../types/offers-catalog.types'
import type { PDocumentDisplayProps } from '@pulse/styleguide/types'
import { APICallStatus } from '@pulse/common/enums'

export interface CatalogDrawerProps {
  isOpened: boolean
  offer: OfferDescription
  offerReferents?: OfferCatalogReferent[]
  offerDocuments?: OfferCatalogDocument[]
  offerPdf: PDocumentDisplayProps['pSrc']
  pdfApiCallStatus: APICallStatus
  offerReferentsApiCallStatus: APICallStatus
}
