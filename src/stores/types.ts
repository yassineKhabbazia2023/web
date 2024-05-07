export interface Entity {
  accountId: number
  accountNumber: string
  legalName: string
  color?:
    | 'orange'
    | 'persian'
    | 'cyan'
    | 'amethyste'
    | 'teal'
    | 'green'
    | 'fuschia'
    | 'gray'
}

type Entities = {
  favorites: Entity[] | undefined
  default: Entity | undefined
}

export interface UserInfo {
  id: string
  firstName: string
  lastName: string
  occupation: string
  email: string
  entities: Entities
  isCollab: boolean
  gigyaUserId: string
}
