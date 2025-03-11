import type { Report } from '@app/types/bi-reports.types'

export interface GetReportsRequest {
  items: Report[]
  currentPage: number
  totalItems: number
  totalPage: number
}
