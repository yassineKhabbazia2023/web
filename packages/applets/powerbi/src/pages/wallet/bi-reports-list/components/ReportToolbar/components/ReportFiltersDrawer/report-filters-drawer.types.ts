import type { ReportFilters } from '@powerbi/types/bi-reports.types'

export interface ReportFiltersDrawerProps {
  modelValue: boolean
  hasActiveFilters: boolean
  reportFilters: ReportFilters
}
