import { getAvatarColorFromKey } from '@pulse/styleguide'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import type {
  MappedReportRow,
  ReportFilterQueryParams,
  ReportSearchCriteria,
  ReportStatusTag,
  ReportTableRow,
} from '@entities/common/types/BIReportsTypes'
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

/**
 * Maps frontend search criteria to API query parameters for report fetching.
 *
 * Converts:
 * - `currentPage` → `pageNumber`
 * - `limit`       → `pageSize`
 */
export function getQueryParams(searchCriteria: ReportSearchCriteria): ReportFilterQueryParams {
  return {
    pageNumber: searchCriteria.currentPage,
    pageSize: searchCriteria.limit,
    search: searchCriteria.search,
    reportStatusFilter: searchCriteria.reportStatusFilter,
    reportTypeIdFilter: searchCriteria.reportTypeIdFilter,
  }
}

/**
 * Builds and sanitizes query parameters for fetching reports.
 *
 * - Transforms `ReportSearchCriteria` into API-compatible query parameters via `getQueryParams`.
 * - Removes any falsy values (e.g., null, undefined, empty strings) using `removeFalsyValues`
 *   to avoid sending unnecessary or invalid query params to the backend.
 */
export const getReportsQueryParams = (reportSearchCriteria: ReportSearchCriteria): ReportFilterQueryParams => {
  const queryParams = getQueryParams(reportSearchCriteria)
  const queryParamasCleaned = removeFalsyValues(queryParams)

  return queryParamasCleaned
}
