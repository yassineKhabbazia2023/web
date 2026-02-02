import type { ClientContact, SubscriptionOfferServices } from '@entities/types'

export type PrincipalContactProps = {
  principalContact: ClientContact
  currentSubscriptionOffer?: SubscriptionOfferServices
}
