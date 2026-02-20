import type { SubscriptionOfferServices } from '@entities/types'
import type { PrincipalContactItem } from '@entities/components/PrincipalContact/PrincipalContactTypes'

export interface CustomersDetailsProps {
  principalContacts: PrincipalContactItem[]
  currentSubscriptionOffer?: SubscriptionOfferServices
}
