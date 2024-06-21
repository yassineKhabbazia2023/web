import { describe, it, expect, vi } from 'vitest'
import { fetchBIReports } from '.'
import {
  getMockedBIReports,
} from '@/layouts/Home/Sidebar/components/SidebarEntity/components/SidebarEntityMenu/SidebarEntityMenuMocks'

const mockedAccountId = 602
const mockedBIReports = getMockedBIReports()

vi.mock('@kpmg/common', () => ({
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
