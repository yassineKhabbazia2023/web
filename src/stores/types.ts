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

export interface SelectedEntity extends Entity {
  permissions?: string[]
}

type Entities = {
  favorites: Entity[] | undefined
  default: SelectedEntity | undefined
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
