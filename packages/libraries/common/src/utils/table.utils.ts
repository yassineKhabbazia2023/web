import type { PaginationData } from '../types/table.types'

export function getPaginationLabel<T>(onLabel: string, {
  currentPage,
  limit,
  data,
  totalItems,
}: PaginationData<T>) {
  if (currentPage === undefined || limit === undefined || totalItems === undefined) {
    return ''
  }
  const displayCount = data.length
  const pageIndex = currentPage === 0 ? 0 : currentPage - 1
  const firstRowNumber = 1 + pageIndex * limit
  const lastRowNumber = pageIndex * limit + displayCount

  return `${firstRowNumber} - ${lastRowNumber} ${onLabel} ${totalItems}`
}
