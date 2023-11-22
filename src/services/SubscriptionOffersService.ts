import {
  getMockedSubscriptionOffers
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersMocks'

export async function getSubscriptionOffers(accountNumber: string) {
  console.log(accountNumber) // temporary code
  return getMockedSubscriptionOffers()
}
