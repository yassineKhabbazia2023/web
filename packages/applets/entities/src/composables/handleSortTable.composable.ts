import { SortingCriteria } from '@pulse/common/types'

export function handleSort(sortCriteria: SortingCriteria, tableProps: any) {
  tableProps.sorting.field = sortCriteria.field
  tableProps.sorting.descending = sortCriteria.descending
  tableProps.currentPage = 1
}
