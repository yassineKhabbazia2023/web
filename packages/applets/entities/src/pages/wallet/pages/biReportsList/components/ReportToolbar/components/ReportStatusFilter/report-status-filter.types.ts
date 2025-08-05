import type { ReportFilters, ReportStatistics } from '@entities/common/types/BIReportsTypes'

export interface ReportStatusFilterProps {
  reportFilters: ReportFilters
  reportStatistics: ReportStatistics
}
