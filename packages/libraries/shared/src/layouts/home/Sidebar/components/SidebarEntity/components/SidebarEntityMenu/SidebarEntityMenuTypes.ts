import type { Permission } from '@pulse/common/types'

export interface SidebarEntityMenuProps {
  currentEntityId: number
  isCollab?: boolean
  isSingleEntity?: boolean
  currentEntityPermissions?: Permission[]
}
