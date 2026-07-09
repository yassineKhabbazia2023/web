import type { LastActivityPeriodInDays } from '@entities/enums'

export interface WalletCustomFilterParams {
  isFavoriteFilter: boolean
  isCustomerRelationFilter: boolean
  missionTypeFilter?: string[]
  deploymentStatusFilter?: string[]
  lastActivityPeriodFilter?: LastActivityPeriodInDays
}
