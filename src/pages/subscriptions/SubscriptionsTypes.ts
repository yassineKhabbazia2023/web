export interface SubscriptionDemand {
  account: {
    accountNumber: string
  }
  applicant: string
  offer: {
    offerId: number
  }
  user: {
    email: string
  }
}

export interface Contact {
  contactId: number
  firstName: string
  lastName: string
  email: string
}

/* eslint-disable no-unused-vars */
export enum SubscriptionStatusCode {
  PENDING = 'pending',
  VALIDATED = 'validated'
}
/* eslint-enable no-unused-vars */

export interface SubscriptionRequest {
  subscriptionId: number
  account: {
    accountId: number
    accountNumber: string
    accountLegalName: string
  }
  applicant: string
  offer: {
    offerId: number
    offerLabel: string
  }
  clients: Contact[]
  subscriptionDate: string
  creationDate: string
  status: SubscriptionStatusCode
}

export interface SubscriptionAccount {
  accountId: number
  accountNumber: string
  accountLegalName?: string
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

export interface PostSubscriptionRequest {
  accountId: number
  offerId: number
  productConfigurations: number[]
  contacts: number[]
  notes: Note[]
  applicant: string
}
