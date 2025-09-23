import { describe, it, expect, beforeEach } from 'vitest'
import { getPaginationLabel } from './table.utils'
import type { PaginationData } from '../types/table.types'

describe('getPaginationLabel', () => {
  let params: PaginationData<number>
  beforeEach(() => {
    params = {
      currentPage: 1,
      limit: 3,
      data: [0, 1, 2],
      totalItems: 55,
    }
  })

  it('should return proper pagination label when value are given on page 0', () => {
    params.currentPage = 0
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '1 - 3 sur 55'
    expect(paginationLabel).toBe(expected)
  })

  it('should return proper pagination label when value are given on page 1', () => {
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '1 - 3 sur 55'
    expect(paginationLabel).toBe(expected)
  })

  it('should return proper pagination label when value are given on page 2', () => {
    params.currentPage = 2
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '4 - 6 sur 55'
    expect(paginationLabel).toBe(expected)
  })

  it('should return proper pagination label when totalItems is undefined', () => {
    params.totalItems = undefined
    const paginationLabel = getPaginationLabel('sur', params)
    expect(paginationLabel).toBe('')
  })

  it('should return proper pagination label when currentPage is undefined', () => {
    params.currentPage = undefined
    const paginationLabel = getPaginationLabel('sur', params)
    expect(paginationLabel).toBe('')
  })
})
