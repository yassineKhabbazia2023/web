import type { AccountFilters } from '@entities/types'

export interface AccountFiltersDrawerProps {
  modelValue: boolean
  hasActiveFilters: boolean
  accountFilters: AccountFilters
}

export type MultiSelectFilterField = Extract<keyof AccountFilters, 'missionTypeFilter' | 'deploymentStatusFilter'>

export interface FilterOptionConfig {
  value: string
  labelKey: string
}

export interface FilterGroupConfig {
  labelKey: string
  field: MultiSelectFilterField
  options: FilterOptionConfig[]
}
