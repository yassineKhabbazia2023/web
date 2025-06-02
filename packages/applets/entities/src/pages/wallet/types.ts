import type { QueryResult } from '@pulse/common/types'
import type { PaginationData } from '@entities/helper/helperTypes'
import type { IconName } from '@pulse/styleguide/types'

export interface DeploymentStatus {
  text: string
  color: string
  iconName: IconName
}

export interface WalletData {
  owner: {
    contactId: number
    firstName: string
    lastName: string
    email: string | null
    initials: string | undefined
    avatarColor: string
  }
  city: string
  hub: string
  deploymentStatus: DeploymentStatus
  id: string
  accountId: number
  accountNumber: string
  name: string
  isFavorite: boolean
  isCustomerRelation: boolean
}
export interface State extends PaginationData<WalletData> {
  totalPage: number | undefined
  search: string | undefined
  isLoading: boolean | undefined
  filterByDeploymentStatus: string | undefined
}

export interface SearchCriteria {
  currentPage: number
  limit: number
  search?: string
  accountNumber?: string
  filterByDeploymentStatus?: string
}

export interface FilterQueryParams {
  pageNumber: number,
  pageSize: number,
  search?: string,
  accountNumber?: string,
  deploymentStatus?: string,
}

// we want to use SearchResult as an alias for QueryResult<WalletData>
export type SearchResult<T> = QueryResult<T>
