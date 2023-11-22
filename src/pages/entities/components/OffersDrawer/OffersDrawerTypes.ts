import type { SubscriptionOffer } from '../SubscriptionOffers/SubscriptionOffersTypes'

export interface OffersDrawerProps {
  modelValue: boolean,
  subscriptionOffers: SubscriptionOffer[],
}
