import type { SubscriptionOffer } from '@entities/types'

export interface SubscriptionOffersProps {
  subscriptionOffers: SubscriptionOffer[]
  activeOffers: string[]
}
