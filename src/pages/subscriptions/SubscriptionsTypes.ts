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
  statusCode: string
}
