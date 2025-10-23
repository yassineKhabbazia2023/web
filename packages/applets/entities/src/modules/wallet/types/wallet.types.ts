import type { QueryResult, SortingCriteria, PaginationData } from '@pulse/common/types'
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
  sorting: SortingCriteria
  accountNumber?: string
  filterByDeploymentStatus?: string
  isFavoriteFilter?: boolean
  isCustomerRelationFilter?: boolean
}

export interface FilterQueryParams {
  pageNumber: number,
  pageSize: number,
  search?: string,
  'sorting.field': string | undefined,
  'sorting.descending': boolean | undefined,
  accountNumber?: string,
  deploymentStatus?: string,
  isFavoriteFilter?: boolean
  isCustomerRelationFilter?: boolean
}

// we want to use SearchResult as an alias for QueryResult<WalletData>
export type SearchResult<T> = QueryResult<T>
