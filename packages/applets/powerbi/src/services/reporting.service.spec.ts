import { apiGatewayMock, apiGatewayGetMock, apiGatewayPostMock, apiGatewayPatchMock } from '@pulse/common/mocks'
import { activateSmartOfferTrial, fetchBIReports, fetchBIReportTypes, fetchBIToken, fetchReportAccounts, uploadBIreport } from './reporting.service'

const mockReportUploadInfo = {
  accountId: 2,
  reportTypeId: 5,
  reportFile: new File(['Test Report'], 'my-report.pbx'),
  reportName: 'My Test Report',
  reportId: 6,
}

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

describe('BI Reporting Services', () => {
  describe('fetchBIReports()', () => {
    it('should fetch all BI reports for an account', async () => {
      const mockData = [{ id: 1, name: 'Report 1' }]
      apiGatewayGetMock.mockResolvedValue({ data: mockData })

      const result = await fetchBIReports(123)

      expect(apiGatewayGetMock).toHaveBeenCalledWith('reporting/api/reports/currentuser', {
        params: {
          accountId: 123,
          reportTypeId: undefined,
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should fetch BI reports for an account with a report type', async () => {
      const mockData = [{ id: 1, name: 'Report 1', typeId: 456 }]
      apiGatewayGetMock.mockResolvedValue({ data: mockData })

      const result = await fetchBIReports(123, 456)

      expect(apiGatewayGetMock).toHaveBeenCalledWith('reporting/api/reports', {
        params: {
          accountId: 123,
          reportTypeId: 456,
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      apiGatewayGetMock.mockRejectedValue(error)

      await expect(fetchBIReports(123)).rejects.toThrow('API Error')
    })
  })

  describe('fetchBIToken()', () => {
    it('should fetch an embed token for a report', async () => {
      const mockToken = 'mock-embed-token'
      apiGatewayGetMock.mockResolvedValue({ data: mockToken })

      const result = await fetchBIToken('report-123', 456)

      expect(apiGatewayGetMock).toHaveBeenCalledWith('reporting/api/reports/report-123/embedToken?accountId=456')
      expect(result).toBe(mockToken)
    })

    it('should handle API errors when fetching token', async () => {
      const error = new Error('Token fetch failed')
      apiGatewayGetMock.mockRejectedValue(error)

      await expect(fetchBIToken('report-123', 456)).rejects.toThrow('Token fetch failed')
    })

    it('should return correct token type', async () => {
      const mockToken = 'valid-token-string'
      apiGatewayGetMock.mockResolvedValue({ data: mockToken })

      const result = await fetchBIToken('report-456', 789)

      expect(typeof result).toBe('string')
      expect(result).toBe(mockToken)
    })
  })

  describe('fetchBIReportTypes()', () => {
    it('should fetch all BI report types', async () => {
      apiGatewayGetMock.mockImplementation(() => Promise.resolve({ data: {} }))
      await fetchBIReportTypes()

      expect(apiGatewayGetMock).toHaveBeenCalledWith('reporting/api/reportType')
    })
  })

  describe('activateSmartOfferTrial()', () => {
    it('should trigger the activation of the Smart Offer trial for the given account', async () => {
      const accountId = 602
      await activateSmartOfferTrial(accountId)

      expect(apiGatewayPatchMock).toHaveBeenCalledWith(
        'account/api/activate-offer/currentuser',
        {},
        { params: { accountId } },
      )
    })
  })

  describe('fetchReportAccounts()', () => {
    it('should fetch all report accounts', async () => {
      apiGatewayGetMock.mockImplementation(() => Promise.resolve({ data: {} }))
      await fetchReportAccounts('')

      expect(apiGatewayGetMock).toHaveBeenCalledWith('reporting/api/account')
    })

    it('should fetch report accounts with a search query', async () => {
      apiGatewayGetMock.mockImplementation(() => Promise.resolve({ data: {} }))
      await fetchReportAccounts('currentUser?search=test')

      expect(apiGatewayGetMock).toHaveBeenCalledWith('reporting/api/account/currentUser?search=test')
    })
  })

  describe('uploadBIreport()', () => {
    it('should upload a BI report with the given data', async () => {
      const { accountId, reportFile, reportId, reportName, reportTypeId } = mockReportUploadInfo

      await uploadBIreport(accountId, reportTypeId, reportFile, reportName, reportId)

      expect(apiGatewayPostMock).toHaveBeenCalledOnce()
    })
  })
})
