import type { OfferPlan, SubscriptionOfferServices } from '@entities/types'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { ContactType } from '@pulse/common/enums'

export enum SubscriptionStatusCode {
  PENDING = 'pending',
  VALIDATED = 'validated',
  PENNYLANE_CREATED = 'pennylane-created',
  PENNYLANE_NOT_CREATED = 'pennylane-not-created',
  PENNYLANE_TO_VERIFY = 'pennylane-to-verify',
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
    offerName: string
    logoName: string
    plans?: OfferPlan[]
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
  hubName?: string
  offerId: number
  productConfigurations: number[]
  contacts: number[]
  notes: Note[]
  applicant: string
  contactFunctions?: ContactFunction[]
  planId?: number
  planPricingId?: number
  hasNoSiren?: boolean
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
  hasNoSiren?: boolean
}

export interface SubscriptionStats {
  statuses: Partial<Record<SubscriptionStatusCode, number>>
}

export interface FetchSubscriptionRequestsParams {
  statusCodes?: SubscriptionStatusCode[]
  offerCodes?: string[]
  page?: number
  pageSize?: number
  sortField?: string
  sortDescending?: boolean
}
