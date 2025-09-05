import { describe, it, expect, vi } from 'vitest'
import { apiGatewayGetMock } from '../../__mocks__/api-gateway.mocks'
import { ReportingService } from './reporting.service'

vi.mock('../../api', () => ({
  default: () => ({
    gateway: {
      get: apiGatewayGetMock,
    },
  }),
}))

describe('ReportingService', () => {
  describe('getTotalBIReports', () => {
    it('should call the API and return totalItems', async () => {
      const accountId = 602
      const expectedUrl = 'reporting/api/reports/currentuser'
      const mockResponse = { totalItems: 10 }

      apiGatewayGetMock.mockResolvedValueOnce({
        data: mockResponse,
      })

      const totalItems = await ReportingService.getTotalBIReports(accountId)

      expect(apiGatewayGetMock).toHaveBeenCalledOnce()
      expect(apiGatewayGetMock).toHaveBeenCalledWith(expectedUrl, {
        params: { accountId },
      })
      expect(totalItems).toBe(10)
    })
  })
})
