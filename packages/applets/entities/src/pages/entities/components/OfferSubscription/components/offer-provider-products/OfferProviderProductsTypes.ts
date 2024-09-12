import type {
  SubscriptionOfferProvider,
} from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { SelectedProduct } from '@entities/common/types'
import type { PService } from '@kpmg/styleguide'
export interface OfferProviderProductsProps {
  offerId: number
  offerProvider: SubscriptionOfferProvider
  selectedProducts: SelectedProduct[]
  isRecap?: boolean
}

export interface ExtendedService extends PService {
  productConfigurationId: number
}
