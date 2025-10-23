import type { SubscriptionOfferServices, SelectedProduct } from '@entities/types'

export interface OfferSubscriptionProps {
  subscriptionOffer: SubscriptionOfferServices
  selectedProducts: SelectedProduct[]
}
