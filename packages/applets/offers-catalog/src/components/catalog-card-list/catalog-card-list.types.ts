import type { OfferDescription } from '../../types/offers-catalog.types'
import { APICallStatus } from '@pulse/common/enums'

export interface CatalogCardListProps {
  offers: OfferDescription[]
  apiCallStatus: APICallStatus
  offerRecommendationsId: string
  isSmartSearchEnabled: boolean
}
