import {
  getMockedSubscriptionOffers
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersMocks'

export function getSubscriptionOffers(accountId: string) {
  return getMockedSubscriptionOffers(accountId)
}
