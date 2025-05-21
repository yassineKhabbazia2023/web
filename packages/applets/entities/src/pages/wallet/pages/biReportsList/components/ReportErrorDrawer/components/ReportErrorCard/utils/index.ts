import { ReportTypeEnum } from '@entities/common/types/BIReports.enums'
import type { ReportTypeTag } from '../report-error-card.type'

export const getReportTypeTag = (
  reportType: Record<ReportTypeEnum, ReportTypeTag>,
  reportTypeEnum: ReportTypeEnum,
): ReportTypeTag => {
  return reportType[reportTypeEnum]
}
