import { describe, it, expect, vi } from 'vitest'
import { fetchBIReports } from '.'
import { getMockedBIReports } from '@/pages/power-bi/pages/bi-reports/BIReportsMocks'

const mockedReports = getMockedBIReports()
const mockedAccountId = 602

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: vi.fn().mockResolvedValue({ data: mockedReports }),
    },
  }),
}))

describe('reportingServices', () => {
  describe('fetchBIReports', () => {
    it('should return the BI reports', async () => {
      const reports = await fetchBIReports(mockedAccountId)

      expect(reports).toStrictEqual(mockedReports)
    })
  })
})
