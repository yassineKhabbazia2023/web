import type { Permission } from '../types/permission.type'
import type { Address } from '../types/account.types'

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

type Entities = {
  default: CurrentEntity | undefined
}

export interface Persona {
  id: number
  name: string
  description?: string
}

export interface UserInfo {
  id: number
  firstName: string
  lastName: string
  occupation: string
  email: string
  entities: Entities
  isCollab: boolean
  gigyaUserId: string
  officeMobile?: string
  oldId?: string
  persona?: Persona
}

export interface UserContextInfo {
  contact: UserInfo
  permissions: Permission[]
  favoriteEntities: Entity[]
}

export interface UserInfoApi {
  id: number
  firstName: string
  lastName: string
  email: string
  officePhone: string
  officeMobile: string
  isCustomer: boolean
  oldId: string
  persona: Persona
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

export interface Hub {
  hubId: number
  hubName?: string
}
