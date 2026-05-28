import type { ReportTypeEnum } from '@powerbi/enums/bi-reports.enum'

export interface ReportErrorCardProps {
  reportName: string
  embedReportId: string
  reportType: ReportTypeEnum
  messages: string[]
  detectionDate: string
}
