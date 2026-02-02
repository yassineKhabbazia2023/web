import type { ClientContact, SubscriptionOfferServices } from '@entities/types'

export interface CustomersDetailsProps {
  principalContacts: ClientContact[]
  currentSubscriptionOffer?: SubscriptionOfferServices
}
