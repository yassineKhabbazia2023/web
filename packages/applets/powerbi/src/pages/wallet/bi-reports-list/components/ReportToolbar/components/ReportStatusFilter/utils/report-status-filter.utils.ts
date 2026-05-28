import { ReportStatus } from '@powerbi/enums/bi-reports.enum'
import type { ReportStatistics } from '@powerbi/types/bi-reports.types'
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
      pColor: 'gray',
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
