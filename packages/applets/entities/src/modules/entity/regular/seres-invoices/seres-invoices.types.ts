import type { SortDirection } from '@pulse/common/enums'

export interface SeresInvoiceItem {
  id: number
  name: string
  depositDate: string
  invoiceYear: number
}

export interface SeresInvoicesResponse {
  items: SeresInvoiceItem[]
  totalItems: number
}

export interface SeresInvoicesSearchCriteria {
  page: number
  pageSize: number
  search: string
  sortBy: string
  sortOrder: SortDirection | null
}
