import type { ReportTypeEnum } from '@powerbi/enums/bi-reports.enum'
import type { ReportTypeTag } from '@powerbi/types/bi-reports.types'

export const getReportTypeTag = (
  reportTypes: Record<ReportTypeEnum, ReportTypeTag>,
  reportType: ReportTypeEnum,
): ReportTypeTag => {
  return reportTypes[reportType] || { text: reportType, iconName: 'clipboardData' }
}
