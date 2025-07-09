import { describe, it, expect, vi } from 'vitest'
import { getMockedBIReports } from '@entities/__mocks__/bi-report.mocks'
import { API_PREFIXES } from '@entities/common/config/services'
import { PAGE_SIZES } from '@entities/constants'

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
} from '.'
import { ReportStatus } from '@entities/common/types/BIReports.enums'
import { serializeParams } from '@pulse/core/utils/http'

const mockReportId = 15
const mockAccountId = 602
const mockReportTypeId = 1
const mockBIReports = getMockedBIReports()
const mockDefaultReport = mockBIReports[0]
const mockReportUploadInfo = {
  accountId: 2,
  reportTypeId: 5,
  reportFile: new File(['Test Report'], 'my-report.pbx'),
  reportName: 'My Test Report',
  reportId: 6,
}

const mockPostBIReport = vi.hoisted(() => vi.fn())
const mockPatchBIReport = vi.hoisted(() => vi.fn())
const mockGetBIReport = vi.hoisted(() => vi.fn(() => Promise.resolve({ data: {} })))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGetBIReport,
      post: mockPostBIReport,
      patch: mockPatchBIReport,
    },
  }),
}))

describe('BI Reporting Services', () => {
  describe('fetchBIReports()', () => {
    it('should fetch all BI reports for an account', async () => {
      await fetchBIReports(mockAccountId)

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports/currentuser`, {
        params: { accountId: mockAccountId, reportTypeId: undefined },
      })
    })

    it('should fetch BI reports for an account with a report type', async () => {
      await fetchBIReports(mockAccountId, mockReportTypeId)

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports`, {
        params: { accountId: mockAccountId, reportTypeId: mockReportTypeId },
      })
    })
  })

  describe('fetchReportAccounts()', () => {
    it('should fetch all report accounts', async () => {
      await fetchReportAccounts('')

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/account`)
    })

    it('should fetch report accounts with a search query', async () => {
      await fetchReportAccounts('currentUser?search=test')

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/account/currentUser?search=test`)
    })
  })

  describe('fetchReportErrors()', () => {
    it('should fetch all report errors', async () => {
      await fetchReportErrors()

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/report-errors`)
    })
  })

  describe('fetchReportStatistics()', () => {
    it('should fetch report statistics', async () => {
      await fetchReportStatistics()

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports/statistics`)
    })
  })

  describe('fetchBIToken()', () => {
    it('should fetch an embed token for a report', async () => {
      const { embededReportId, accountId } = mockDefaultReport

      await fetchBIToken(embededReportId, accountId)

      expect(mockGetBIReport).toHaveBeenCalledWith(
        `${API_PREFIXES.REPORTING}/reports/${embededReportId}/embedToken?accountId=${accountId}`,
      )
    })
  })

  describe('fetchBIReportTypes()', () => {
    it('should fetch all BI report types', async () => {
      await fetchBIReportTypes()

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reportType`)
    })
  })

  describe('uploadBIreport()', () => {
    it('should upload a BI report with the given data', async () => {
      const { accountId, reportFile, reportId, reportName, reportTypeId } = mockReportUploadInfo

      await uploadBIreport(accountId, reportTypeId, reportFile, reportName, reportId)

      expect(mockPostBIReport).toHaveBeenCalledOnce()
    })
  })

  describe('fetchAvailableReports()', () => {
    it('should fetch paginated list of available reports', async () => {
      const queryParams = { pageNumber: 2, pageSize: PAGE_SIZES[0] }

      await fetchAvailableReports(queryParams)

      expect(mockGetBIReport).toHaveBeenCalledWith(`${API_PREFIXES.REPORTING}/reports/available`, {
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

      expect(mockPatchBIReport).toHaveBeenCalledWith(
        `${API_PREFIXES.REPORTING}/reports`,
        expectedPayload,
        expectedParams,
      )
    })
  })
})
