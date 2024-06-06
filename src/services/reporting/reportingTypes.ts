import type { Report } from '@/pages/power-bi/pages/bi-reports/BIReportsTypes'

export interface GetReportsRequest {
  items: Report[]
  currentPage: number
  totalItems: number
  totalPage: number
}
