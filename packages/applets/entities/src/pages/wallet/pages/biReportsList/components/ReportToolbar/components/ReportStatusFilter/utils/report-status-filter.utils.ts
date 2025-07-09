import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type { ReportStatistics } from '@entities/common/types/BIReportsTypes'
import type { FilterOption } from '@pulse/styleguide/types'

export function getReportStatusFilter(
  reportStatusFilterLabels: Record<string, string>,
  reportStatistics?: ReportStatistics,
) {
  const reportStatusFilter: FilterOption<ReportStatus | undefined>[] = [
    {
      pContent: reportStatusFilterLabels['failed'],
      pCode: ReportStatus.FAILED,
      pValue: reportStatistics?.failed,
      pColor: 'danger',
      pIconName: 'exclamationTriangle',
    },
    {
      pContent: reportStatusFilterLabels['offline'],
      pCode: ReportStatus.OFFLINE,
      pValue: reportStatistics?.offline,
      pColor: 'gray-900',
      pIconName: 'eyeSlash',
    },
    {
      pContent: reportStatusFilterLabels['online'],
      pCode: ReportStatus.ONLINE,
      pValue: reportStatistics?.online,
      pColor: 'success',
      pIconName: 'checkCircle',
    },
  ]

  return reportStatusFilter
}
