import type { UserInfo } from '@pulse/common/types'

export interface DigitalSafeCustomer {
  contactId: number
  contactGlobalUniqueId: string
  firstName: string
  lastName: string
  email: string
  landPhone: string
  mobilePhone: string
  type: string
  status: string
  personaName: string
  creationDate: string
  isActive: boolean
  actionLevel: number
  labels: string[]
}

export interface InvoicesFullFormModel {
  // Step 1
  email: string
  acceptTerms: boolean
  // Step 2
  selectedContactId: DigitalSafeCustomer['contactId'] | null
}

export interface InvoicesFormModel {
  email: string
  acceptTerms: boolean
}

export interface BillingSubmissionInputRequest {
  dematerializationEmail: string
  firstName: string
  lastName: string
  vaultEmail: string
  requesterEmail: UserInfo['email']
}
