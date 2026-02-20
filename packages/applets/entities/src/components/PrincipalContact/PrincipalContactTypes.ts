import type { SubscriptionOfferServices } from '@entities/types'

export interface PrincipalContactItem {
  contactId: number
  firstName: string
  lastName: string
  email: string
  mobilePhone?: string
}

export type PrincipalContactProps = {
  principalContact: PrincipalContactItem
  currentSubscriptionOffer?: SubscriptionOfferServices
}
