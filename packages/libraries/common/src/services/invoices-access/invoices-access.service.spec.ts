import { AxiosError } from 'axios'
import { apiGatewayMock } from '../../__mocks__/vitest'
import { API_PREFIXES } from '../../constants/api-prefixes'
import { getInvoicesAccessResponseMock } from '../../__mocks__'

import { InvoicesAccessService } from './invoices-access.service'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

vi.mock('env-vars', () => ({
  VITE_API_GATEWAY: 'https://api.mock.com',
}))

describe('InvoicesAccessService', () => {
  describe('fetchInvoicesAccess', () => {
    it('should return mapped access data on successful response', async () => {
      const accountId = 123456
      const expectedUrl = `${API_PREFIXES.INVOICES}/accounts/${accountId}/currentuser`
      const apiResponse = {
        'tab-state': 'form-start',
        contactWithAccess: 'contact@example.com',
        externalDematMail: 'dmat@example.com',
      }

      apiGatewayMock.get.mockResolvedValueOnce({ data: apiResponse })

      const result = await InvoicesAccessService.fetchInvoicesAccess(accountId)

      expect(result).toStrictEqual(getInvoicesAccessResponseMock())
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    })

    it('should return null on 404 error', async () => {
      const accountId = 123456
      const error = new AxiosError('Not Found', '404', undefined, undefined, {
        status: 404,
        data: null,
        headers: {},
        statusText: 'Not Found',
        config: {} as any,
      })

      apiGatewayMock.get.mockRejectedValueOnce(error)

      const result = await InvoicesAccessService.fetchInvoicesAccess(accountId)

      expect(result).toBeNull()
    })

    it('should rethrow non-404 errors', async () => {
      const accountId = 123456
      const error = new AxiosError('Server Error', '500', undefined, undefined, {
        status: 500,
        data: null,
        headers: {},
        statusText: 'Internal Server Error',
        config: {} as any,
      })

      apiGatewayMock.get.mockRejectedValueOnce(error)

      await expect(InvoicesAccessService.fetchInvoicesAccess(accountId)).rejects.toThrow(error)
    })
  })
})
