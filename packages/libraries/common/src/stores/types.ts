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
  color?: EntityColor
}

export interface SelectedEntity extends Entity {
  permissions?: string[]
}

type Entities = {
  favorites: Entity[] | undefined
  default: SelectedEntity | undefined
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

export interface Address {
  addressId: number
  addressLine1?: string
  addressLine2?: string
  addressLine3?: string
  addressType?: 'delivery' | 'billing'
  state?: string
  zipCode?: string
  country?: string
  city?: string
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
