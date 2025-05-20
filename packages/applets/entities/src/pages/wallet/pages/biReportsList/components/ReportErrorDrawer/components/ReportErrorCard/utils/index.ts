import { ReportTypeEnum } from '@entities/common/types/BIReports.enums'
import { ReportTypeTag } from '../types/report-error-card.type'

export const getReportTypeTag = (
  reportType: Record<string, ReportTypeTag>,
  reportTypeEnum: ReportTypeEnum,
): ReportTypeTag => {
  return reportType[reportTypeEnum]
}
