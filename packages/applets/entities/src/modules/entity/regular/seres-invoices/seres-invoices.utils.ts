import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { SORT_ORDER_PARAMS } from './seres-invoices.consts'
import type { SeresInvoicesSearchCriteria } from './seres-invoices.types'

export function buildInvoicesSearchParams(criteria: SeresInvoicesSearchCriteria): URLSearchParams {
  const searchParams = new URLSearchParams()

  searchParams.append('PageNumber', criteria.page.toString())
  searchParams.append('PageSize', criteria.pageSize.toString())

  if (isNotNullNorEmpty(criteria.search)) {
    searchParams.append('Search', criteria.search)
  }

  // No sort is sent until the user picks one: the API then applies its own default ordering.
  if (criteria.sortOrder !== null && isNotNullNorEmpty(criteria.sortBy)) {
    searchParams.append('SortBy', criteria.sortBy)
    searchParams.append('SortOrder', SORT_ORDER_PARAMS[criteria.sortOrder])
  }

  return searchParams
}
