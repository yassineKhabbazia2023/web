import type { PTagProps } from '@pulse/styleguide/types'
import type { Entity, QueryResult, SortingCriteria } from '@pulse/common/types'
import type { ReportStatus, ReportTypeEnum } from '@powerbi/enums/bi-reports.enum'

export interface ReportStatusTag {
  text: string
  type: ReportStatus
  color: PTagProps['pColor']
  iconName: PTagProps['pIconLeftName']
}

export interface ReportType {
  reportTypeId: number
  name: string
  collaboratorLabel: string
  customerLabel: string
}

export interface ReportTypeTag {
  text: string
  iconName?: PTagProps['pIconLeftName']
}

export interface Report {
  accountId: number
  reportId: number
  reportLabel: string
  documentName: string
  embededReportUrl: string
  embededReportId: string
  name: string
  createdBy: string
  creationDate?: string
  type: ReportType
  updateDate?: string
  dataUpdateDate?: string
}

type BaseReportExcludes = 'documentName' | 'embededReportId' | 'embededReportUrl'

export interface ReportTableRow extends Omit<Report, BaseReportExcludes> {
  embedReportId: string
  embedReportUrl: string
  typeLabel: string
  accountNumber: string
  legalName: string
  status: ReportStatus
}

export interface MappedReportRow extends Omit<ReportTableRow, 'status'> {
  status: ReportStatusTag
  avatarColor: string
}

export interface ReportError {
  embedReportId: string
  reportName: string
  reportType: ReportTypeEnum
  messages: string[]
  detectionDate: string
}

export interface ReportErrorData {
  errors: ReportError[]
  totalItems: number
}

export interface PaginationParams {
  currentPage: number
  limit: number
  search?: string
}

export interface ReportFilters {
  reportStatusFilter?: ReportStatus[]
  reportTypeIdFilter?: number[]
}

export interface ReportStatistics {
  online: number
  offline: number
  failed: number
}

export interface ReportFilterQueryParams extends ReportFilters {
  pageNumber: number
  pageSize: number
  search?: string
}

export interface ReportSearchCriteria extends PaginationParams, ReportFilters {}

export interface ReportQueryParams extends ReportFilters {
  currentPage: number
  limit: number
  search?: string
  sorting: SortingCriteria
}

export type GetReportsRequest = QueryResult<Report>

export type GetReportAccountsRequest = QueryResult<Entity>

export interface ReportInfo {
  reportId?: number
  reportLabel?: string
  reportTypeId?: number
  accountId?: number
  accountLabel?: string
}

export interface SearchResult<T> {
  currentPage: number
  items: T[]
  totalPage: number
  totalItems: number
}
