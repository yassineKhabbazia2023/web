import type { SubscriptionOfferServices } from '../SubscriptionOffers/SubscriptionOffersTypes'
import type { SelectedProduct } from '@entities/common/types'

export interface OfferSubscriptionProps {
  subscriptionOffer: SubscriptionOfferServices
  selectedProducts: SelectedProduct[]
}
