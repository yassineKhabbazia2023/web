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
    isFavoriteFilter: searchCriteria.isFavoriteFilter,
    isCustomerRelationFilter: searchCriteria.isCustomerRelationFilter,
  }
}

export function getSearchParams(searchCriteria: SearchCriteria, allAccounts: boolean = false) {
  const queryParams = getQueryParams(searchCriteria)
  const queryParamsWithoutUndefined = removeFalsyValues(queryParams)
  const searchParams = new URLSearchParams(queryParamsWithoutUndefined)

  if (searchCriteria.filterByDeploymentStatus !== undefined
      && searchCriteria.filterByDeploymentStatus.length > 0) {
    searchCriteria.filterByDeploymentStatus.forEach((status) => {
      searchParams.append('deploymentStatus', status.toString())
    })
  }

  if (searchCriteria.filterByMissionType !== undefined
      && searchCriteria.filterByMissionType.length > 0) {
    searchCriteria.filterByMissionType.forEach((missionType) => {
      searchParams.append('missionType', missionType)
    })
  }

  return `${allAccounts ? 'all' : 'currentuser'}?${searchParams}`
}
