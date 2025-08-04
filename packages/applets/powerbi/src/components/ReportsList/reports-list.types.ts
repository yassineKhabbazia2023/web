import type { Report } from '@powerbi/types/bi-reports.types'

export interface ReportsListProps {
  reports: Report[]
  selectedReport: Report
}
