import type { Address } from '@pulse/common/types'

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

export interface Account {
  accountId: number
  accountNumber: string
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

export interface PermanentDelegationDelegatee {
  contactId: number
  firstName: string
  lastName: string
  email: string
}

export interface PermanentDelegationApiItem {
  delegationId: number
  startDate: string
  delegatee: PermanentDelegationDelegatee
}

export interface SearchAccountItem {
  accountId: number
  legalName: string
  accountNumber: string
  siret?: string
  directorEmail?: string
}
