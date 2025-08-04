import { commonApi } from '@pulse/common'

import { fetchBIReports, fetchBIToken } from './reporting.service'

vi.mock('@pulse/common')

const mockGet = vi.fn()
const mockCommonApi = vi.mocked(commonApi)

describe('BI Reporting Services', () => {
  beforeEach(() => {
    mockCommonApi.mockReturnValue({
      gateway: {
        get: mockGet,
      },
    } as any)
  })

  describe('fetchBIReports()', () => {
    it('should fetch all BI reports for an account', async () => {
      const mockData = [{ id: 1, name: 'Report 1' }]
      mockGet.mockResolvedValue({ data: mockData })

      const result = await fetchBIReports(123)

      expect(mockGet).toHaveBeenCalledWith('reporting/api/reports/currentuser', {
        params: {
          accountId: 123,
          reportTypeId: undefined,
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should fetch BI reports for an account with a report type', async () => {
      const mockData = [{ id: 1, name: 'Report 1', typeId: 456 }]
      mockGet.mockResolvedValue({ data: mockData })

      const result = await fetchBIReports(123, 456)

      expect(mockGet).toHaveBeenCalledWith('reporting/api/reports', {
        params: {
          accountId: 123,
          reportTypeId: 456,
        },
      })
      expect(result).toEqual(mockData)
    })

    it('should handle API errors', async () => {
      const error = new Error('API Error')
      mockGet.mockRejectedValue(error)

      await expect(fetchBIReports(123)).rejects.toThrow('API Error')
    })
  })

  describe('fetchBIToken()', () => {
    it('should fetch an embed token for a report', async () => {
      const mockToken = 'mock-embed-token'
      mockGet.mockResolvedValue({ data: mockToken })

      const result = await fetchBIToken('report-123', 456)

      expect(mockGet).toHaveBeenCalledWith('reporting/api/reports/report-123/embedToken?accountId=456')
      expect(result).toBe(mockToken)
    })

    it('should handle API errors when fetching token', async () => {
      const error = new Error('Token fetch failed')
      mockGet.mockRejectedValue(error)

      await expect(fetchBIToken('report-123', 456)).rejects.toThrow('Token fetch failed')
    })

    it('should return correct token type', async () => {
      const mockToken = 'valid-token-string'
      mockGet.mockResolvedValue({ data: mockToken })

      const result = await fetchBIToken('report-456', 789)

      expect(typeof result).toBe('string')
      expect(result).toBe(mockToken)
    })
  })
})
