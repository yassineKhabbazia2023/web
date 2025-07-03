import { APICallStatus } from '@pulse/common/enums'
import type { OfferCatalogDocument } from '../../types/offers-catalog.types'

export interface CatalogDrawerContentDocumentsProps {
  offerDocuments?: OfferCatalogDocument[]
  apiCallStatus: APICallStatus
}

export interface InternalCategory {
  documents: OfferCatalogDocument[]
  categoryLabel: string
}
