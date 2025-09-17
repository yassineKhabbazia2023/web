import { SortingCriteria } from '@pulse/common/types'
import type { Contact, UserStatus } from '@entities/common/types'

export interface UsersClientProps {
  entityId: number | undefined
}

export interface ExtendedUser extends Contact {
  initials: string
  fullName: string
  isLoggedUser: boolean
  isOwner: boolean
  isSignatory: boolean
  statusTag?: UserStatus
}

export interface State {
  data: ExtendedUser[]
  currentPage: number
  limit: number
  totalPages: number | undefined
  totalItems: number | undefined
  search: string | undefined
  sorting: SortingCriteria
  isLoading: boolean
  isDrawerViewDetailsOpened: boolean
  isManageRightsDrawerOpened: boolean
  isRemoveUserDialogOpened: boolean
  userToRemove: ExtendedUser | undefined
  selectedUserId: number
}
