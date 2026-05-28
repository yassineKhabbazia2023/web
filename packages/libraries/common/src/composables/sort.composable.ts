import { SortingCriteria } from '@pulse/common/types'

export function useSort() {
  const handleSortCriteria = (sortCriteria: SortingCriteria, tableProps: any) => {
    tableProps.sorting.field = sortCriteria.field
    tableProps.sorting.descending = sortCriteria.descending
    tableProps.currentPage = 1
  }

  return {
    handleSortCriteria,
  }
}
