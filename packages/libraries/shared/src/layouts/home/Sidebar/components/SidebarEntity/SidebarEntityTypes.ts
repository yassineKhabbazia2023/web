import type { Entity, Permission } from '@pulse/common/types'
import type { UserConfig } from '@shared/layouts/home/home.layout.types'

export interface SidebarEntityProps {
  currentEntity?: Entity
  favoriteEntities: Entity[]
  userConfig?: UserConfig
  currentEntityPermissions?: Permission[]
}
