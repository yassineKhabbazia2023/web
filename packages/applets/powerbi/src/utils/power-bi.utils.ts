import { getAvatarColorFromKey } from '@pulse/styleguide'
import { ReportStatus } from '@powerbi/enums/bi-reports.enum'
import type {
  MappedReportRow,
  ReportQueryParams,
  ReportStatusTag,
  ReportTableRow,
} from '@powerbi/types/bi-reports.types'
import { removeFalsyValues } from '@pulse/core/utils/object'

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
export function getQueryParams(reportCriteria: ReportQueryParams) {
  return {
    pageNumber: reportCriteria.currentPage,
    pageSize: reportCriteria.limit,
    search: reportCriteria.search,
    reportStatusFilter: reportCriteria.reportStatusFilter,
    reportTypeIdFilter: reportCriteria.reportTypeIdFilter,
    field: reportCriteria.sorting.field,
    descending: reportCriteria.sorting.descending,
  }
}

/**
 * Builds and sanitizes query parameters for fetching reports.
 *
 * - Transforms `ReportSearchCriteria` into API-compatible query parameters via `getQueryParams`.
 * - Removes any falsy values (e.g., null, undefined, empty strings) using `removeFalsyValues`
 *   to avoid sending unnecessary or invalid query params to the backend.
 */
export const getReportsQueryParams = (reportSearchCriteria: ReportQueryParams): ReportQueryParams => {
  const queryParams = getQueryParams(reportSearchCriteria)
  const queryParamsCleaned = removeFalsyValues(queryParams)

  return queryParamsCleaned
}
