import { SortingCriteria } from '@pulse/common/types'
import type { ExtendedUser } from '@entities/types'

export interface UsersClientProps {
  entityId: number | undefined
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
