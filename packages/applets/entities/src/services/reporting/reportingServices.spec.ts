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
} from '.'

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
const mockGetBIReport = vi.hoisted(() => vi.fn(() => Promise.resolve({ data: {} })))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGetBIReport,
      post: mockPostBIReport,
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
      })
    })
  })
})
