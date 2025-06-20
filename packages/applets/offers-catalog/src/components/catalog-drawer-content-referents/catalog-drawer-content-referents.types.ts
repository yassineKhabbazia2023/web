import { APICallStatus } from '@pulse/common/enums'
import type { OfferCatalogReferent } from '../../types/offers-catalog.types'

export interface CatalogDrawerContentReferentsProps {
  offerReferents?: OfferCatalogReferent[]
  apiCallStatus: APICallStatus
}
