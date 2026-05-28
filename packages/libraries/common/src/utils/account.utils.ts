import type { FilterQueryParams, SearchCriteria } from '../types/account.types'
import { removeFalsyValues } from '@pulse/toolbox/utils/object'

export function getQueryParams(searchCriteria: SearchCriteria): FilterQueryParams {
  return {
    pageNumber: searchCriteria.currentPage,
    pageSize: searchCriteria.limit,
    search: searchCriteria.search,
    'sorting.field': searchCriteria.sorting?.field,
    'sorting.descending': searchCriteria.sorting?.descending,
    accountNumber: searchCriteria.accountNumber,
    deploymentStatus: searchCriteria.filterByDeploymentStatus,
    isFavoriteFilter: searchCriteria.isFavoriteFilter,
    isCustomerRelationFilter: searchCriteria.isCustomerRelationFilter,
  }
}

export function getSearchParams(searchCriteria: SearchCriteria, allAccounts: boolean = false) {
  const queryParams = getQueryParams(searchCriteria)
  const queryParamsWithoutUndefined = removeFalsyValues(queryParams)
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  return `${allAccounts ? 'all' : 'currentuser'}?${searchParams}`
}
