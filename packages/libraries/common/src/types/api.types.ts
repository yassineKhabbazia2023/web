export interface PaginationResponse<T> {
  items: T[]
  currentPage: number
  totalItems: number
  totalPages: number
}

export interface QueryResult<T> {
  items: T[]
  currentPage: number
  totalItems: number
  totalPage: number
}

export interface SortingCriteria {
  field?: string
  descending: boolean
}
