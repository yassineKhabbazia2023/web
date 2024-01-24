import type { SubscriptionOfferServices } from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { SelectedProduct } from '../OffersDrawer/OffersDrawerTypes'

export interface OfferSubscriptionProps {
  subscriptionOffer: SubscriptionOfferServices,
  selectedProducts: SelectedProduct[]
}
