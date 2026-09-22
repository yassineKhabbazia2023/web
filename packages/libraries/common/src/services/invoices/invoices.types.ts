/**
 * Subset of the demat account payload the solicitation relies on.
 * The endpoint returns the full account, only these fields are mapped.
 */
export interface DematAccountApiResponse {
  accountId: number
  email?: string
  accountRoutingCode?: string
  modalClosedAt?: string
}

export interface DematAccountResponse {
  accountId: number
  dematMail: string | null
  routingCode: string | null
  modalClosedAt: string | null
}

export interface DematMailSubmissionRequest {
  dematerializationEmail: string
  requesterEmail: string
}

export interface HubspotSubmissionApiResponse {
  isSuccess: boolean
}
