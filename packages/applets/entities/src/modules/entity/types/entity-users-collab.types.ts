import type { UserStatus } from '@entities/types'
import type { SortingCriteria, PaginationData } from '@pulse/common/types'

export interface User {
  contactId: number
  initials: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  isOwner: boolean
  role?: string
  status?: string | UserStatus
  firstDateAccess?: string
}

export interface StateUser extends PaginationData<User> {
  currentPage: number
  limit: number
  totalItems: number | undefined
  totalPage: number | undefined
  isLoading: boolean | undefined
  sorting: SortingCriteria
  search: string | undefined
}
