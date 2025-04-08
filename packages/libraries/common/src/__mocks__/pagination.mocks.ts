import type { PaginationResponse } from '@pulse/common/types'

export function getPaginationMock<T>(override: Partial<PaginationResponse<T>> = {}) {
  const defaultResponse: PaginationResponse<T> = {
    items: [],
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  }

  return {
    ...defaultResponse,
    ...override,
  }
}
