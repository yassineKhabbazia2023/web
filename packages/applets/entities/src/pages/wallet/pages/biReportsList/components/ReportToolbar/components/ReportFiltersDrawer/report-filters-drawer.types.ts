import type { ReportFilters } from '@entities/common/types/BIReportsTypes'

export interface ReportFiltersDrawerProps {
  modelValue: boolean
  hasActiveFilters: boolean
  reportFilters: ReportFilters
}
