export interface SubscriptionDemand {
  account: {
    accountNumber: string
  }
  applicant: string
  offer: {
    globalOfferId: string
  }
  user: {
    email: string
  }
}

export interface User {
  globalUserId: string
  firstName: string
  lastName: string
  email: string
}

/* eslint-disable no-unused-vars */
export enum SubscriptionStatusCode {
  PENDING = 'Pending',
  VALIDATED = 'Validated'
}
/* eslint-enable no-unused-vars */

export interface SubscriptionRequest {
  subscriptionId: number
  account: {
    globalAccountId: string
    accountNumber: string
    accountLabel: string
  }
  applicant: string
  offer: {
    globalOfferId: string
    offerLabel: string
  }
  users: User[]
  subscriptionDate: string
  creationDate: string
  statusCode: SubscriptionStatusCode
}

export interface SubscriptionAccount {
  globalAccountId: string,
  accountNumber: string,
  accountLabel?: string,
  hub?: string,
  accounting?: {
    beginningFiscalDate: string,
    durationFiscalDate: string,
    accountingMethod: string,
    taxRegime: string,
    activityType: string
  },
  accountTva?: {
    tvaRegime: string,
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
  products: number[]
  contacts: number[]
  notes: Note[]
  applicant: string
}
