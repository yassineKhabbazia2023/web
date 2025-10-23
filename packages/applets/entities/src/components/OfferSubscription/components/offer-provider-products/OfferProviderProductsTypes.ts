import type { SubscriptionOfferProvider, SelectedProduct } from '@entities/types'
import type { PService } from '@pulse/styleguide/types'

export interface OfferProviderProductsProps {
  offerId: number
  offerProvider: SubscriptionOfferProvider
  selectedProducts: SelectedProduct[]
  isRecap?: boolean
}

export interface ExtendedService extends PService {
  productConfigurationId: number
}
