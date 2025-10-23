import type { AccountFilters } from '@entities/types'

export interface AccountFiltersDrawerProps {
  modelValue: boolean
  hasActiveFilters: boolean
  accountFilters: AccountFilters
}
