import type { Report } from '@entities/common/types/BIReportsTypes'
import type { Entity, QueryResult } from '@pulse/common/types'

export type GetReportsRequest = QueryResult<Report>

export type GetReportAccountsRequest = QueryResult<Entity>
