import type { Report, ReportErrorDetail } from '@entities/common/types/BIReportsTypes'
import type { Entity, QueryResult } from '@pulse/common/types'

export type GetReportsRequest = QueryResult<Report>

export type GetReportAccountsRequest = QueryResult<Entity>

export type GetReportErrorsRequest = QueryResult<ReportErrorDetail>
