
type Entity = {
  idAccount: string
  name: string
  icon: string
  color: string
}

type Entities = {
  favorites: Entity[] | undefined
  default: Entity | undefined
}

export type UserInfo = {
  firstName: string
  lastName: string
  occupation: string
  email: string
  token: string
  id: string
  isCollab: boolean
  entities: Entities
}
