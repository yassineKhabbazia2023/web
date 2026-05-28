import { describe, it, vi, expect, beforeEach } from 'vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { getMockedActivity, getMockedActivitiesResponse, getMockedThemes } from '../__mocks__/history.mocks'
import { HistoryService } from './history.service'

const commonApiGetMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/api', () => {
  return {
    api: ({
      gateway: {
        get: commonApiGetMock,
      },
    }),
  }
})

// Helper to convert URLSearchParams to an object for easier testing
const urlSearchParamsToObject = (params: URLSearchParams): Record<string, string | string[]> => {
  const result: Record<string, string | string[]> = {}
  const keys = Array.from(params.keys())
  const uniqueKeys = [...new Set(keys)]

  uniqueKeys.forEach((key) => {
    const values = params.getAll(key)
    result[key] = values.length === 1 ? values[0] : values
  })

  return result
}

describe('HistoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchThemes', () => {
    it('should call the correct endpoint and return themes', async () => {
      const mockThemes = getMockedThemes()
      commonApiGetMock.mockResolvedValue({ data: mockThemes })

      const result = await HistoryService.fetchThemes()

      expect(commonApiGetMock).toHaveBeenCalledWith(`${API_PREFIXES.HISTORY}/themes`)
      expect(result).toStrictEqual(mockThemes)
    })

    it('should throw an error when API fails', async () => {
      const errorMessage = 'API Error'
      commonApiGetMock.mockRejectedValue(new Error(errorMessage))

      await expect(HistoryService.fetchThemes()).rejects.toThrow(errorMessage)
    })
  })

  describe('fetchActivities', () => {
    it('should call the correct endpoint with proper params', async () => {
      const mockActivities = [getMockedActivity(1), getMockedActivity(2)]
      const mockResponse = getMockedActivitiesResponse(mockActivities, 10)

      commonApiGetMock.mockResolvedValue({ data: mockResponse })

      const criteria = {
        accountId: 123,
        page: 1,
        pageSize: 10,
      }

      await HistoryService.fetchActivities(criteria)

      expect(commonApiGetMock).toHaveBeenCalledOnce()
      const callArgs = commonApiGetMock.mock.calls[0]
      expect(callArgs[0]).toBe(`${API_PREFIXES.HISTORY}/activities/currentuser`)

      const params = callArgs[1].params as URLSearchParams
      expect(urlSearchParamsToObject(params)).toEqual({
        accountId: '123',
        pageNumber: '1',
        pageSize: '10',
        'Sorting.Field': 'createDate',
        'Sorting.Descending': 'true',
      })
    })

    it('should return the activities response on success', async () => {
      const mockActivities = [getMockedActivity(1), getMockedActivity(2)]
      const mockResponse = getMockedActivitiesResponse(mockActivities, 10)

      commonApiGetMock.mockResolvedValue({ data: mockResponse })

      const criteria = {
        accountId: 123,
        page: 1,
        pageSize: 10,
      }

      const result = await HistoryService.fetchActivities(criteria)

      expect(result).toStrictEqual(mockResponse)
    })

    it('should pass pagination params correctly', async () => {
      const mockResponse = getMockedActivitiesResponse([], 0)

      commonApiGetMock.mockResolvedValue({ data: mockResponse })

      const criteria = {
        accountId: 456,
        page: 3,
        pageSize: 25,
      }

      await HistoryService.fetchActivities(criteria)

      expect(commonApiGetMock).toHaveBeenCalledOnce()
      const callArgs = commonApiGetMock.mock.calls[0]

      const params = callArgs[1].params as URLSearchParams
      expect(urlSearchParamsToObject(params)).toEqual({
        accountId: '456',
        pageNumber: '3',
        pageSize: '25',
        'Sorting.Field': 'createDate',
        'Sorting.Descending': 'true',
      })
    })

    it('should throw an error when API fails', async () => {
      const errorMessage = 'API Error'
      commonApiGetMock.mockRejectedValue(new Error(errorMessage))

      const criteria = {
        accountId: 123,
        page: 1,
        pageSize: 10,
      }

      await expect(HistoryService.fetchActivities(criteria)).rejects.toThrow(errorMessage)
    })

    it('should include search parameter when provided', async () => {
      const mockResponse = getMockedActivitiesResponse([], 0)
      commonApiGetMock.mockResolvedValue({ data: mockResponse })

      const criteria = {
        accountId: 123,
        page: 1,
        pageSize: 10,
        search: 'test search',
      }

      await HistoryService.fetchActivities(criteria)

      expect(commonApiGetMock).toHaveBeenCalledOnce()
      const callArgs = commonApiGetMock.mock.calls[0]

      const params = callArgs[1].params as URLSearchParams
      expect(urlSearchParamsToObject(params)).toEqual({
        accountId: '123',
        pageNumber: '1',
        pageSize: '10',
        'Sorting.Field': 'createDate',
        'Sorting.Descending': 'true',
        search: 'test search',
      })
    })

    it('should not include search parameter when empty string', async () => {
      const mockResponse = getMockedActivitiesResponse([], 0)
      commonApiGetMock.mockResolvedValue({ data: mockResponse })

      const criteria = {
        accountId: 123,
        page: 1,
        pageSize: 10,
        search: '',
      }

      await HistoryService.fetchActivities(criteria)

      expect(commonApiGetMock).toHaveBeenCalledOnce()
      const callArgs = commonApiGetMock.mock.calls[0]

      const params = callArgs[1].params as URLSearchParams
      expect(urlSearchParamsToObject(params)).toEqual({
        accountId: '123',
        pageNumber: '1',
        pageSize: '10',
        'Sorting.Field': 'createDate',
        'Sorting.Descending': 'true',
      })
    })

    it('should not include search parameter when undefined', async () => {
      const mockResponse = getMockedActivitiesResponse([], 0)
      commonApiGetMock.mockResolvedValue({ data: mockResponse })

      const criteria = {
        accountId: 123,
        page: 1,
        pageSize: 10,
      }

      await HistoryService.fetchActivities(criteria)

      expect(commonApiGetMock).toHaveBeenCalledOnce()
      const callArgs = commonApiGetMock.mock.calls[0]

      const params = callArgs[1].params as URLSearchParams
      expect(urlSearchParamsToObject(params)).toEqual({
        accountId: '123',
        pageNumber: '1',
        pageSize: '10',
        'Sorting.Field': 'createDate',
        'Sorting.Descending': 'true',
      })
    })

    describe('filter parameters', () => {
      it('should include categoryIds when provided', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          categoryIds: [1, 2, 3],
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        expect(urlSearchParamsToObject(params)).toEqual({
          accountId: '123',
          pageNumber: '1',
          pageSize: '10',
          'Sorting.Field': 'createDate',
          'Sorting.Descending': 'true',
          CategoryIds: ['1', '2', '3'],
        })
      })

      it('should include themeIds when provided', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          themeIds: [5, 10],
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        expect(urlSearchParamsToObject(params)).toEqual({
          accountId: '123',
          pageNumber: '1',
          pageSize: '10',
          'Sorting.Field': 'createDate',
          'Sorting.Descending': 'true',
          ThemeIds: ['5', '10'],
        })
      })

      it('should not include categoryIds when empty array', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          categoryIds: [],
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        const paramsObj = urlSearchParamsToObject(params)
        expect(paramsObj.CategoryIds).toBeUndefined()
      })

      it('should not include themeIds when undefined', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        const paramsObj = urlSearchParamsToObject(params)
        expect(paramsObj.ThemeIds).toBeUndefined()
      })

      it('should include fromDate when provided', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          fromDate: '2024-01-01T00:00:00.000Z',
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        expect(urlSearchParamsToObject(params)).toEqual({
          accountId: '123',
          pageNumber: '1',
          pageSize: '10',
          'Sorting.Field': 'createDate',
          'Sorting.Descending': 'true',
          FromDate: '2024-01-01T00:00:00.000Z',
        })
      })

      it('should include toDate when provided', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          toDate: '2024-12-31T23:59:59.999Z',
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        expect(urlSearchParamsToObject(params)).toEqual({
          accountId: '123',
          pageNumber: '1',
          pageSize: '10',
          'Sorting.Field': 'createDate',
          'Sorting.Descending': 'true',
          ToDate: '2024-12-31T23:59:59.999Z',
        })
      })

      it('should not include fromDate when empty string', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          fromDate: '',
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        const paramsObj = urlSearchParamsToObject(params)
        expect(paramsObj.FromDate).toBeUndefined()
      })

      it('should include all filter parameters together', async () => {
        const mockResponse = getMockedActivitiesResponse([], 0)
        commonApiGetMock.mockResolvedValue({ data: mockResponse })

        const criteria = {
          accountId: 123,
          page: 1,
          pageSize: 10,
          search: 'test',
          categoryIds: [1, 2],
          themeIds: [10],
          fromDate: '2024-01-01T00:00:00.000Z',
          toDate: '2024-12-31T23:59:59.999Z',
        }

        await HistoryService.fetchActivities(criteria)

        expect(commonApiGetMock).toHaveBeenCalledOnce()
        const callArgs = commonApiGetMock.mock.calls[0]

        const params = callArgs[1].params as URLSearchParams
        expect(urlSearchParamsToObject(params)).toEqual({
          accountId: '123',
          pageNumber: '1',
          pageSize: '10',
          'Sorting.Field': 'createDate',
          'Sorting.Descending': 'true',
          search: 'test',
          ThemeIds: '10',
          CategoryIds: ['1', '2'],
          FromDate: '2024-01-01T00:00:00.000Z',
          ToDate: '2024-12-31T23:59:59.999Z',
        })
      })
    })
  })
})
