import type { Report } from '@entities/common/types/BIReportsTypes'

export interface ReportsListProps {
  reports: Report[]
  selectedReport: Report
}
