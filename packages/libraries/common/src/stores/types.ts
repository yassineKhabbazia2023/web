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
}
