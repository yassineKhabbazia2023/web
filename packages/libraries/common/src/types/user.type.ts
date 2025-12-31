import type { Permission } from './permission.type'
import type { Entity, Entities } from './entities.type'

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
