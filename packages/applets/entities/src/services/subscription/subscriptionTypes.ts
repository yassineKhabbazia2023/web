import type { SubscriptionOfferServices } from '@entities/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { ContactType } from '@pulse/common/enums'

export enum SubscriptionStatusCode {
  PENDING = 'pending',
  VALIDATED = 'validated',
}

export interface Account {
  accountId: number
  accountNumber: string
  accountLegalName?: string
}

export interface SubscriptionRequest {
  subscriptionId: number
  account: Account
  applicant: string
  offer: {
    offerId: number
    offerCode: string
    offerLabel: string
  }
  clients: Contact[]
  subscriptionDate: string
  creationDate: string
  status: SubscriptionStatusCode
}

export interface SubscriptionAccount extends Account {
  hub?: string
  accounting?: {
    beginningFiscalDate: string
    durationFiscalDate: string
    accountingMethod: string
    taxRegime: string
    activityType: string
  }
  accountTva?: {
    tvaRegime: string
    tvaType: string
  }
}

export interface Note {
  stepName: string
  stepNote: string
}

export interface ContactFunction {
  contactId: number
  functionId: number
}

export interface PostSubscriptionRequest {
  accountId: number
  offerId: number
  productConfigurations: number[]
  contacts: number[]
  notes: Note[]
  applicant: string
  contactFunctions?: ContactFunction[]
}

export interface SubscriptionContact {
  contactId: number
  firstName: string
  lastName: string
  email: string
  type: ContactType
  functionId?: number
}

export interface SubscriptionDetails {
  subscriptionId: number
  account: Account
  offer: SubscriptionOfferServices
  clients: SubscriptionContact[]
  collaborators: SubscriptionContact[]
  notes: Note[]
}
