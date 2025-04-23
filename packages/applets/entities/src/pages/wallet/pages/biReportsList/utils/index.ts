import { getAvatarColorFromKey } from '@pulse/styleguide'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type { MappedReportRow, ReportStatusTag, ReportTableRow } from '@entities/common/types/BIReportsTypes'

export const getMappedReport = (
  reports: ReportTableRow[],
  reportStatus: Record<ReportStatus, ReportStatusTag>,
): MappedReportRow[] => {
  const mappedReports = reports.map((report: ReportTableRow) => {
    return {
      ...report,
      avatarColor: getAvatarColorFromKey(report.accountNumber) as string,
      status: reportStatus[report.status],
    }
  })

  return mappedReports
}
