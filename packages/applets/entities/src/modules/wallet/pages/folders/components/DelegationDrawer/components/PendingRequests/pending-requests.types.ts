export interface PendingRequestRequester {
  firstName: string
  lastName: string
}

export interface PendingRequestAccount {
  legalName: string
  accountNumber: string
}

export interface PendingRequestItem {
  delegationRequestId: number
  createdAt: string
  requester: PendingRequestRequester
  account: PendingRequestAccount
}
