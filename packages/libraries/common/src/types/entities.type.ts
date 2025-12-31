import type { Deployment, Address, Office, Subscription } from '@common/types'
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
  missionType: string
  officeId: number
  office: Office
  address: Address,
  deployment: Deployment
  subscriptions: Subscription[]
}

export type MockEntityKey = 'BASIC' | 'LEGACY_GED' | 'PENNYLANE'

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
