import { SortDirection } from '@pulse/common/enums'
import { buildInvoicesSearchParams } from './seres-invoices.utils'
import type { SeresInvoicesSearchCriteria } from './seres-invoices.types'

function getCriteria(overrides: Partial<SeresInvoicesSearchCriteria> = {}): SeresInvoicesSearchCriteria {
  return {
    page: 2,
    pageSize: 15,
    search: '',
    sortBy: '',
    sortOrder: null,
    ...overrides,
  }
}

describe('buildInvoicesSearchParams', () => {
  it('should always send the pagination params', () => {
    const params = buildInvoicesSearchParams(getCriteria())

    expect(params.get('PageNumber')).toBe('2')
    expect(params.get('PageSize')).toBe('15')
  })

  it('should send the search param when the search is filled', () => {
    const params = buildInvoicesSearchParams(getCriteria({ search: 'FAC-2026' }))

    expect(params.get('Search')).toBe('FAC-2026')
  })

  it('should not send the search param when the search is empty', () => {
    const params = buildInvoicesSearchParams(getCriteria())

    expect(params.has('Search')).toBe(false)
  })

  it.each([
    { order: SortDirection.ASCENDING, expectedParam: 'asc' },
    { order: SortDirection.DESCENDING, expectedParam: 'desc' },
  ])('should send the $expectedParam sort order once a sort is applied', ({ order, expectedParam }) => {
    const params = buildInvoicesSearchParams(getCriteria({ sortBy: 'invoiceYear', sortOrder: order }))

    expect(params.get('SortBy')).toBe('invoiceYear')
    expect(params.get('SortOrder')).toBe(expectedParam)
  })

  it('should not send any sorting param while no sort is applied', () => {
    const params = buildInvoicesSearchParams(getCriteria())

    expect(params.has('SortBy')).toBe(false)
    expect(params.has('SortOrder')).toBe(false)
  })

  it('should not send any sorting param when a column is sorted without direction', () => {
    const params = buildInvoicesSearchParams(getCriteria({ sortBy: 'invoiceYear', sortOrder: null }))

    expect(params.has('SortBy')).toBe(false)
    expect(params.has('SortOrder')).toBe(false)
  })
})
