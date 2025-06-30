import type { AccountFilters } from '@entities/common/types'

export interface AccountFiltersDrawerProps {
  modelValue: boolean
  hasActiveFilters: boolean
  accountFilters: AccountFilters
}
