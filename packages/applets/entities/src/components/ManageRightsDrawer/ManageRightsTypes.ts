import type { Entity, Permission } from '@pulse/common/types'
import type { User } from '@entities/types'

export interface AuthorizationState {
  actions: Permission[]
  isActive: boolean
}

export interface ManageRightsDrawerProps {
  modelValue: boolean
  selectedUser: User
  currentEntity: Entity
}

export type LabelByPermission = { [Key in Permission]?: string | undefined }
