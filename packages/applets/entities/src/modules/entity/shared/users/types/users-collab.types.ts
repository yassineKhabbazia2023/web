import type { SortingCriteria, PaginationData } from '@pulse/common/types'
import type { User } from '@entities/types'

export interface StateUser extends PaginationData<User> {
  currentPage: number
  limit: number
  totalItems: number | undefined
  totalPage: number | undefined
  isLoading: boolean | undefined
  sorting: SortingCriteria
  search: string | undefined
}
