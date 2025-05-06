import { getAvatarColorFromKey } from '@pulse/styleguide'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type { MappedReportRow, ReportStatusTag, ReportTableRow } from '@entities/common/types/BIReportsTypes'
import { FilterQueryParams, SearchCriteria } from '@entities/pages/wallet/types'
import { getQueryParams } from '../../folders/DeployUtils'
import { removeFalsyValues } from '@entities/helper'

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

export const getReportsQueryParams = (searchCriteria: SearchCriteria): FilterQueryParams => {
  const queryParams = getQueryParams(searchCriteria)
  const queryParamasCleaned = removeFalsyValues(queryParams)

  return queryParamasCleaned
}
