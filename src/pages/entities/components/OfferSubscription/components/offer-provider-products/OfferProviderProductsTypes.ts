import type {
  SubscriptionOfferProvider
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { SelectedProduct } from '@/pages/entities/components/OffersDrawer/OffersDrawerTypes'
import type { PService } from '@kpmg/styleguide'
export interface OfferProviderProductsProps {
  offerId: number
  offerProvider: SubscriptionOfferProvider
  selectedProducts: SelectedProduct[]
}

export interface ExtendedService extends PService {
  productId: string
}
