import { apiGatewayGetMock } from '../../__mocks__/vitest'
import { ReportingService } from './reporting.service'

describe('ReportingService', () => {
  describe('getTotalBIReports', () => {
    it('should call the API and return totalItems', async () => {
      const accountId = 602
      const expectedUrl = 'reporting/api/reports/currentuser'
      const mockResponse = { totalItems: 10 }

      apiGatewayGetMock.mockResolvedValue({
        data: mockResponse,
      })

      const totalItems = await ReportingService.getTotalBIReports(accountId)

      expect(apiGatewayGetMock).toHaveBeenCalledExactlyOnceWith(expectedUrl, {
        params: { accountId },
      })
      expect(totalItems).toBe(10)
    })
  })
})
