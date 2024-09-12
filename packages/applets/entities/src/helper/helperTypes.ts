export interface PaginationData<T> {
  currentPage: number | undefined
  limit: number
  data: T[]
  totalItems: number | undefined
}
