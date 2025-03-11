import { describe, it, expect, vi } from 'vitest'
import { getMockedBIReports } from '@app/__mocks__/bi-reports.mocks'

import { fetchBIReports } from '.'

const mockedAccountId = 602
const mockedBIReports = getMockedBIReports()

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: vi.fn(() =>
        Promise.resolve({
          data: mockedBIReports,
        }),
      ),
    },
  }),
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

describe('reportingServices', () => {
  describe('fetchBIReports', () => {
    it('should return the BI reports', async () => {
      const reports = await fetchBIReports(mockedAccountId)

      expect(reports).toStrictEqual(mockedBIReports)
    })
  })
})
