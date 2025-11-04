import type { Entity, Permission } from '@pulse/common/types'

import type { UserConfig } from '../home.layout.types'

export interface SidebarProps {
  currentEntity?: Entity
  favoriteEntities: Entity[]
  userConfig?: UserConfig
  isVisible: boolean
  currentEntityPermissions?: Permission[]
}
