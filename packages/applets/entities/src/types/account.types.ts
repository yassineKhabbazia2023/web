import type { LastActivityPeriodInDays } from '@entities/enums'

export interface AccountRow {
  accountId: number
  name: string
  accountNumber: string
  isCustomerRelation?: boolean
}

export interface AccountFilters {
  isFavoriteFilter: boolean,
  isCustomerRelationFilter: boolean
  missionTypeFilter?: string[]
  deploymentStatusFilter?: string[]
  lastActivityPeriodFilter?: LastActivityPeriodInDays
}
