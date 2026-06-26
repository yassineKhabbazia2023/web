import type { AccountFilters } from '@entities/types'

export const getDefaultAccountFilters = (): AccountFilters => ({
  isFavoriteFilter: false,
  isCustomerRelationFilter: false,
  missionTypeFilter: undefined,
  deploymentStatusFilter: undefined,
})
