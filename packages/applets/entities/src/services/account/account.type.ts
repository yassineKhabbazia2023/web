import type { Address } from '@pulse/common/types'
import type { DelegationRequestStatus } from '@entities/enums'

export interface Accounting {
  fiscalExerciseStartDate?: string
  fiscalExerciseDuration?: number
  accountingType?: string
  activityType?: string
  fiscalSystem?: string
  taxationSystem?: string
}

export interface Naf {
  nafId: number
  nafCode?: string
  nafLabel?: string
}

export interface Legal {
  legalName?: string
  siren?: string
  siret?: string
  createdAt?: string
  legalForm?: string
  legalFormCode?: string
  staffSizeRange?: string
  naf?: Naf[]
  hasNoSiren?: boolean
}

export interface Phone {
  phoneId: number
  phoneNumber?: string
  type?: string
}

export interface Vat {
  system?: string
  intra?: string
  type?: string
}

export interface Hub {
  hubId: number
  hubName?: string
}

export interface Deployment {
  deploymentId: number
  deploymentDate?: string
  status: number
}
export interface Signatory {
  contactId: number
  globalContactId: string
  firstName: string
  lastName: string
  email: string
  status: string
  personaName: string
  creationDate: string
}

export interface AddressingIdentification {
  callName: string
  addressingIdentifier: string
}

export interface Account {
  accountId: number
  accountNumber: string
  accountRoutingCode?: string
  accountRoutingLabel?: string
  accountLegalFormLabel?: string
  accountElectronicAddressId ?: number
  iconName?: string
  isActive?: boolean
  accountNumberSource?: string
  accountingOffice?: string
  employeeCount?: number
  commercialName?: string
  accounting?: Accounting
  legal?: Legal
  vat?: Vat
  address?: Address[]
  phone?: Phone[]
  email?: string
  hub?: Hub
  deploymentPlanning?: Deployment[]
  addressingIdentifications?: AddressingIdentification[]
}
export interface AccountRow {
  accountId: number
  accountGlobalUniqueId: string
  accountNumber: string
  legalName: string
  isFavorite: boolean
  address: Address
  hub: Hub
  signatory: Signatory
  deployment: Deployment
  isCustomerRelation: boolean
  lastActivityDate: string | null
}

export interface UpdateCustomerRelationRequest {
  isCustomerRelation: boolean
  accountIds: number[]
}

export interface CustomerRelationUpdateSucceeded {
  accountId: number
}

export interface CustomerRelationUpdateFailed {
  accountId: number
  errorCode: string
  errorMessage: string
}

export interface UpdateCustomerRelationResponse {
  succeeded: CustomerRelationUpdateSucceeded[]
  failed: CustomerRelationUpdateFailed[]
}

export type ReferentialOptions = Record<string, string>

export type ReferentialStructure = Record<string, ReferentialOptions>

export interface AccountSignatories {
  contactId: number
  contactGlobalUniqueId: string
  firstName: string
  lastName: string
  email: string
  status: string
  personaName: string
  office: string
  creationDate: string
  mobilePhone?: string
}

export interface AccountsDelegationDetails {
  delegateeId: number
  startDate: string
  isAutomaticDelegation: boolean
}

export interface AccountsDelegation {
  isFullDelegation: boolean
  includePennylaneAccess: boolean
  delegationDetails: AccountsDelegationDetails[]
  accountIds: number[]
}

export interface CreateDelegationRequest {
  accountId: number
  recipientIds: number[]
}

export interface LastCollaboratorCheckResponse {
  isLastCollaboratorOnAny: boolean
  accountIdsWhereLastCollaborator: number[]
}

export interface AccountSelfRemovalRequest {
  accountIds: number[]
}

export interface AccountSelfRemovalItem {
  accountId: number
  errorCode: string | null
  errorMessage: string | null
}

export interface AccountSelfRemovalResponse {
  succeeded: AccountSelfRemovalItem[]
  failed: AccountSelfRemovalItem[]
}

export interface DelegationContact {
  contactId: number
  firstName: string
  lastName: string
  email: string
}

export type PermanentDelegationDelegatee = DelegationContact

export interface PermanentDelegationApiItem {
  delegationId: number
  startDate: string
  delegatee: PermanentDelegationDelegatee
}

export interface DelegationRequestRequester extends DelegationContact {
  isActive: boolean
  actionLevel: number
}

export interface DelegationRequestAccount {
  accountId: number
  accountNumber: string
  legalName: string
  isClarityVisible: boolean
  isSignatory: boolean
}

export interface DelegationRequestApiItem {
  delegationRequestId: number
  requesterId: number
  recipientId: number
  accountId: number
  createdAt: string
  status: DelegationRequestStatus
  requester: DelegationRequestRequester
  account: DelegationRequestAccount
}

export interface SearchAccountItem {
  accountId: number
  legalName: string
  accountNumber: string
  siret?: string
  directorEmail?: string
}
