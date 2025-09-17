import { describe, it, expect } from 'vitest'
import { handleSort } from './handleSortTable.composable'
import { SortingCriteria } from '@pulse/common/types'

describe('handleSort', () => {
  it('should update sorting criteria and reset currentPage', () => {
    const props = {
      sorting: {
        field: 'name',
        descending: false,
      },
      currentPage: 5,
    }

    const newCriteria: SortingCriteria = {
      field: 'date',
      descending: true,
    }

    handleSort(newCriteria, props)

    expect(props.sorting.field).toBe('date')
    expect(props.sorting.descending).toBe(true)
    expect(props.currentPage).toBe(1)
  })
})
