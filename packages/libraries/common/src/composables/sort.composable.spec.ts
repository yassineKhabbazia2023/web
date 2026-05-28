import { describe, it, expect } from 'vitest'
import { useSort } from './sort.composable'
import { SortingCriteria } from '@pulse/common/types'

describe('useSort', () => {
  it('should return handleSortCriteria function', () => {
    const { handleSortCriteria } = useSort()

    expect(handleSortCriteria).toBeTypeOf('function')
  })

  it('should update sorting criteria and reset currentPage', () => {
    const { handleSortCriteria } = useSort()

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

    handleSortCriteria(newCriteria, props)

    expect(props.sorting.field).toBe('date')
    expect(props.sorting.descending).toBe(true)
    expect(props.currentPage).toBe(1)
  })
})
