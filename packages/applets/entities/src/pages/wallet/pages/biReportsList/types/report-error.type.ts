import { ReportTypeEnum } from '@entities/common/types/BIReports.enums'

export interface ErrorReport {
  reportName: string
  embedReportId: string
  reportType: ReportTypeEnum
  messages: string[]
  detectionDate: string
}

export interface ErrorReportData {
  errors: ErrorReport[]
  totalItems: number
}
