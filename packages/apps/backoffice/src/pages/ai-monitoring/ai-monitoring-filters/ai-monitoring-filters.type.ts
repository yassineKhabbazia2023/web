import type { ComputedRef, WritableComputedRef } from 'vue'
import type { PDropdownOption } from '@pulse/styleguide/types'
import type {
  AiMonitoringFiltersState,
  AiMonitoringFeatureOption,
  AiMonitoringFilterOption,
} from '@backoffice/types/ai-monitoring.type'

export interface AiMonitoringFiltersProps {
  filters: AiMonitoringFiltersState
  features: AiMonitoringFeatureOption[]
  users: AiMonitoringFilterOption[]
  isLoading: boolean
}

export type DateRangeValue = [Date, Date] | ''

export interface UseAiMonitoringFiltersEmit {
  (event: 'update:filters', filters: AiMonitoringFiltersState): void
  (event: 'filter-change'): void
  (event: 'reset-filters'): void
}

export interface UseAiMonitoringFiltersReturn {
  dateRangeModel: WritableComputedRef<DateRangeValue>
  featureModel: WritableComputedRef<string | null>
  subFeatureModel: WritableComputedRef<string | null>
  userModel: WritableComputedRef<string | null>
  featureOptions: ComputedRef<PDropdownOption[]>
  subFeatureOptions: ComputedRef<PDropdownOption[]>
  userOptions: ComputedRef<PDropdownOption[]>
  isSubFeatureDisabled: ComputedRef<boolean>
  hasActiveFilters: ComputedRef<boolean>
  handleFilterChange: () => void
  handleReset: () => void
}
