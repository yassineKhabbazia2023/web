import type { Entity, Permission } from '@pulse/common/types'

export interface UserConfig {
  isCollab: boolean
  isCustomer: boolean
  isSingleEntity: boolean
}

export interface HomeLayoutProps {
  currentEntity?: Entity
  favoriteEntities: Entity[]
  userConfig?: UserConfig
  isVisible: boolean
  currentEntityPermissions?: Permission[]
}
