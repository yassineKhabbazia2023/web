import type { Deployment, Address, Office, Subscription } from '@common/types'
import type { AccountType } from '../enums/account-type.enum'
import type { Permission } from './permission.type'

export type EntityColor =
  'orange' |
  'persian' |
  'cyan' |
  'amethyste' |
  'teal' |
  'green' |
  'fuschia' |
  'gray'

export interface Entity {
  accountId: number
  accountType: AccountType
  accountNumber: string
  legalName: string
  isClarityVisible?: boolean
  isSignatory?: boolean
  color?: EntityColor
}

export interface CurrentEntity extends Entity {
  permissions?: Permission[]
}

export type Entities = {
  default: CurrentEntity | undefined
}

export interface EntitySummary extends Entity {
  accountGlobalUniqueId: string
  accountType: AccountType
  missionType: string
  officeId: number
  office: Office
  address: Address
  deployment: Deployment
  subscriptions: Subscription[]
  prospectId: number | null
}

export type MockEntityKey = 'BASIC' | 'LEGACY_GED' | 'PENNYLANE' | 'PROSPECT'

export interface MockUserContact {
  contactId: number
  contactGlobalUniqueId: string
  firstName: string
  lastName: string
  email: string
  status: string
  personaName: string
  creationDate: string
}
