import { API_PREFIXES } from '@pulse/common/constants'
import { apiGatewayGetMock } from '@pulse/common/mocks/vitest'
import { getSeresInvoicesResponseMock } from './__mocks__/seres-invoices.mocks'
import { SeresInvoicesService } from './seres-invoices.service'
import type { SeresInvoicesSearchCriteria } from './seres-invoices.types'

const commonApiGetMock = apiGatewayGetMock

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

describe('SeresInvoicesService', () => {
  describe('fetchInvoices', () => {
    it('should call the account invoices endpoint and return the paginated response', async () => {
      const response = getSeresInvoicesResponseMock()
      commonApiGetMock.mockResolvedValueOnce({ data: response })

      const result = await SeresInvoicesService.fetchInvoices(123, getCriteria())

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.ACCOUNT}/invoices/accounts/123`,
        expect.anything(),
      )
      expect(result).toEqual(response)
    })

    it('should forward the search criteria as query params', async () => {
      commonApiGetMock.mockResolvedValueOnce({ data: getSeresInvoicesResponseMock() })

      await SeresInvoicesService.fetchInvoices(123, getCriteria({ search: 'FAC-2026' }))

      const params = commonApiGetMock.mock.calls[0][1].params as URLSearchParams
      expect(params.get('PageNumber')).toBe('2')
      expect(params.get('PageSize')).toBe('15')
      expect(params.get('Search')).toBe('FAC-2026')
    })

    it.each([
      { payload: '', label: 'an empty body' },
      { payload: null, label: 'a null payload' },
      { payload: undefined, label: 'an undefined payload' },
      { payload: {}, label: 'a payload without items' },
    ])('should return an empty page when the API answers $label', async ({ payload }) => {
      commonApiGetMock.mockResolvedValueOnce({ data: payload })

      const result = await SeresInvoicesService.fetchInvoices(123, getCriteria({ search: 'unknown' }))

      expect(result).toEqual({ items: [], totalItems: 0 })
    })
  })

  describe('fetchInvoiceContent', () => {
    it('should request the invoice content as a pdf blob', async () => {
      const blob = new Blob(['pdf'])
      commonApiGetMock.mockResolvedValueOnce({ data: blob })

      const result = await SeresInvoicesService.fetchInvoiceContent('202506029362', 'ACC123')

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.REGISTRY}/invoices/202506029362/accounts/ACC123/content`,
        { responseType: 'blob' },
      )
      expect(result.type).toBe('application/pdf')
    })
  })
})
