import { getMockedBIReports } from '@powerbi/__mocks__/bi-report.mocks'
import {
  apiGatewayDeleteMock,
  apiGatewayGetMock,
  apiGatewayPatchMock,
  apiGatewayPostMock,
} from '@pulse/common/mocks/vitest'
import { API_PREFIXES, PAGE_SIZES } from '@pulse/common/constants'
import { serializeParams } from '@pulse/toolbox/utils/http'
import { ReportDeleteOption, ReportStatus } from '@powerbi/enums/bi-reports.enum'

import {
  fetchBIReports,
  fetchBIToken,
  fetchBIReportTypes,
  fetchReportAccounts,
  uploadBIreport,
  fetchAvailableReports,
  updateReportStatus,
  fetchReportErrors,
  fetchReportStatistics,
  deleteBIReport,
  activateSmartOfferTrial,
} from './reporting.service'

const mockReportId = 15
const mockAccountId = 602
const mockReportTypeId = 1
const embedReportIdMock = 'test-embed-report-id'
const mockBIReports = getMockedBIReports()
const mockDefaultReport = mockBIReports[0]
const mockReportUploadInfo = {
  accountId: 2,
  reportTypeId: 5,
  reportFile: new File(['Test Report'], 'my-report.pbx'),
  reportName: 'My Test Report',
  reportId: 6,
}

// '@pulse/common/api' is hubbed worker-wide (packages/@config/vitest.setup.hubs.ts):
// the services converge on the shared api-gateway spies armed below.

describe('BI Reporting Services', () => {
  beforeEach(() => {
    // The fetchXxx services destructure `data` from the gateway response.
    apiGatewayGetMock.mockResolvedValue({ data: {} })
  })

  describe('fetchBIReports()', () => {
    it('should fetch all BI reports for an account', async () => {
      await fetchBIReports(mockAccountId)

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports/currentuser`, {
        params: { accountId: mockAccountId, reportTypeId: undefined },
      })
    })

    it('should fetch BI reports for an account with a report type', async () => {
      await fetchBIReports(mockAccountId, mockReportTypeId)

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports`, {
        params: { accountId: mockAccountId, reportTypeId: mockReportTypeId },
      })
    })
  })

  describe('fetchReportAccounts()', () => {
    it('should fetch all report accounts', async () => {
      await fetchReportAccounts('')

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/account`)
    })

    it('should fetch report accounts with a search query', async () => {
      await fetchReportAccounts('currentUser?search=test')

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/account/currentUser?search=test`)
    })
  })

  describe('fetchReportErrors()', () => {
    it('should fetch all report errors', async () => {
      await fetchReportErrors()

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/report-errors`)
    })
  })

  describe('fetchReportStatistics()', () => {
    it('should fetch report statistics', async () => {
      await fetchReportStatistics()

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports/statistics`)
    })
  })

  describe('fetchBIToken()', () => {
    it('should fetch an embed token for a report', async () => {
      const { embededReportId, accountId } = mockDefaultReport

      await fetchBIToken(embededReportId, accountId)

      expect(apiGatewayGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.REPORTING}/reports/${embededReportId}/embedToken?accountId=${accountId}`,
      )
    })
  })

  describe('fetchBIReportTypes()', () => {
    it('should fetch all BI report types', async () => {
      await fetchBIReportTypes()

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reportType`)
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

  describe('deleteBIReport()', () => {
    it('should delete a BI report with the given data', async () => {
      await deleteBIReport(embedReportIdMock, ReportDeleteOption.ALL)

      expect(apiGatewayDeleteMock).toHaveBeenCalledOnce()
    })
  })

  describe('uploadBIreport()', () => {
    it('should upload a BI report with the given data', async () => {
      const { accountId, reportFile, reportId, reportName, reportTypeId } = mockReportUploadInfo

      await uploadBIreport(accountId, reportTypeId, reportFile, reportName, reportId)

      expect(apiGatewayPostMock).toHaveBeenCalledOnce()
    })
  })

  describe('fetchAvailableReports()', () => {
    it('should fetch paginated list of available reports', async () => {
      const queryParams = { currentPage: 2, limit: PAGE_SIZES[0], sorting: { field: '', descending: true } }

      await fetchAvailableReports(queryParams)

      expect(apiGatewayGetMock).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports/available`, {
        params: queryParams,
        paramsSerializer: serializeParams,
      })
    })
  })

  describe('updateReportStatus()', () => {
    it('should send a PATCH request to the correct endpoint with the appropriate payload and query parameters', async () => {
      const expectedPayload = [{ path: '/status', op: 'replace', value: ReportStatus.ONLINE }]

      const expectedParams = {
        params: {
          accountId: mockAccountId,
          reportId: mockReportId,
        },
      }

      await updateReportStatus(mockAccountId, mockReportId, ReportStatus.ONLINE)

      expect(apiGatewayPatchMock).toHaveBeenCalledWith(
        `${API_PREFIXES.REPORTING}/reports`,
        expectedPayload,
        expectedParams,
      )
    })
  })
})
