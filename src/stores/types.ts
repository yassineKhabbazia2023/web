export interface Entity {
  idAccount: string
  name: string
  color:
    | 'orange'
    | 'persian'
    | 'cyan'
    | 'amethyste'
    | 'teal'
    | 'green'
    | 'fuschia'
    | 'gray'
  ibs: string
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
}
