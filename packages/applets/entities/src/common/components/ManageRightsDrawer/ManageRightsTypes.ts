import type { Entity } from '@pulse/common/types'
import type { User } from '@entities/pages/folder/pages/usersCollab/types'

export interface AuthorizationState {
  actions: string[]
  isActive: boolean
}

export interface ManageRightsDrawerProps {
  modelValue: boolean
  selectedUser: User
  selectedEntity: Entity
}
