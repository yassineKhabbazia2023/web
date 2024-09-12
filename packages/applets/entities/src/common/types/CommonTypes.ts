export interface QueryResult<T> {
  currentPage: number
  items: T[]
  totalItems: number
  totalPage: number
}
