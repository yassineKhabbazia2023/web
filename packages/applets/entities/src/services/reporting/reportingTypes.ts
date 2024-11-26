import type { Report } from '@entities/pages/power-bi/pages/bi-reports/BIReportsTypes'
import type { Entity } from '@pulse/common/types'

export interface GetReportsRequest {
  items: Report[]
  currentPage: number
  totalItems: number
  totalPage: number
}

export interface GetReportAccountsRequest {
  items: Entity[]
  currentPage: number
  totalItems: number
  totalPage: number
}
