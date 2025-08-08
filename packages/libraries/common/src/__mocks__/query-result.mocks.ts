import type { QueryResult } from '@pulse/common/types'

export function getMockedQueryResult<T>(override: Partial<QueryResult<T>> = {}) {
  const defaultRecord: QueryResult<T> = {
    items: [],
    currentPage: 1,
    totalItems: 1,
    totalPage: 1,
  }

  return {
    ...defaultRecord,
    ...override,
  }
}
