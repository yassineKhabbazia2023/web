import type { IUser } from '@/pages/folder/pages/usersCollab/types'

export interface AuthorizationState {
  actions: string[]
  isActive: boolean
}

export interface ManageRightsDrawerProps {
  modelValue: boolean
  selectedUser: IUser
}
