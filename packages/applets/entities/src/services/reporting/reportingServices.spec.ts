import { describe, it, expect, vi } from 'vitest'
import {
  fetchBIReports,
  fetchBIToken,
  fetchBIReportTypes,
  fetchReportAccounts,
  uploadBIreport,
} from '.'
import { getMockedBIReports , getMockedBIReportTypes } from '@entities/__mocks__/bi-report.mocks'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import { API_PREFIXES } from '@entities/common/config/services'

const mockedAccountId = 602
const mockedBIToken = 'tokenTest'
const mockedAccount = getMockedAccount()
const mockedBIReports = getMockedBIReports()
const mockedDefaultReport = mockedBIReports[0]
const mockedBIReportTypes = getMockedBIReportTypes()
const mockedReportUploadInfo = {
  accountId: 2,
  reportTypeId: 5,
  reportFile: new File(['Test Report'], 'my-report.pbx'),
  reportName: 'My Test Report',
  reportId: 6,
}
const mockPostBIReport = vi.fn()

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: vi.fn().mockImplementation((url) => {
        const prefix = API_PREFIXES.REPORTING
        const { embededReportId, accountId } = mockedDefaultReport

        if (url === `${prefix}/reports/currentuser`) {
          return Promise.resolve({
            data: mockedBIReports,
          })
        } else if (url === `${prefix}/reports/${embededReportId}/embedToken?accountId=${accountId}`) {
          return Promise.resolve({
            data: mockedBIToken,
          })
        } else if (url === `${prefix}/reportType`) {
          return Promise.resolve({
            data: mockedBIReportTypes,
          })
        } else if (url === `${prefix}/account/`) {
          return Promise.resolve({
            data: mockedAccount,
          })
        }
      }),
      post: mockPostBIReport,
    },
  }),
}))

describe('reportingServices', () => {
  describe('fetchBIReports', () => {
    it('should return the BI reports', async () => {
      const reports = await fetchBIReports(mockedAccountId)

      expect(reports).toStrictEqual(mockedBIReports)
    })
  })
  describe('fetchReportAccounts', () => {
    it('should return account list', async () => {
      const reportAccounts = await fetchReportAccounts('')

      expect(reportAccounts).toStrictEqual(mockedAccount)
    })
  })
  describe('fetchBIToken', () => {
    it('should return the BI token', async () => {
      const { embededReportId, accountId } = mockedDefaultReport

      const biToken = await fetchBIToken(embededReportId, accountId)

      expect(biToken).toStrictEqual(mockedBIToken)
    })
  })
  describe('fetchBIReportTypes', () => {
    it('should return the BI report types', async () => {
      const reportTypes = await fetchBIReportTypes()

      expect(reportTypes).toStrictEqual(mockedBIReportTypes)
    })
  })
  describe('uploadBIreport', () => {
    it('should upload correctly the BI Report', async () => {
      const { accountId, reportFile, reportId, reportName, reportTypeId } =
        mockedReportUploadInfo
      await uploadBIreport(
        accountId,
        reportTypeId,
        reportFile,
        reportName,
        reportId,
      )

      expect(mockPostBIReport).toHaveBeenCalledOnce()
    })
  })
})
