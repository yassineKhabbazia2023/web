import { describe, it, vi, expect, beforeEach } from 'vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { getMockedActivity, getMockedActivitiesResponse } from '../__mocks__/history.mocks'
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

describe('HistoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.HISTORY}/activities/currentuser`,
        {
          params: {
            accountId: 123,
            pageNumber: 1,
            pageSize: 10,
            'Sorting.Field': 'createDate',
            'Sorting.Descending': true,
          },
        },
      )
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

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.HISTORY}/activities/currentuser`,
        {
          params: {
            accountId: 456,
            pageNumber: 3,
            pageSize: 25,
            'Sorting.Field': 'createDate',
            'Sorting.Descending': true,
          },
        },
      )
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

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.HISTORY}/activities/currentuser`,
        {
          params: {
            accountId: 123,
            pageNumber: 1,
            pageSize: 10,
            'Sorting.Field': 'createDate',
            'Sorting.Descending': true,
            search: 'test search',
          },
        },
      )
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

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.HISTORY}/activities/currentuser`,
        {
          params: {
            accountId: 123,
            pageNumber: 1,
            pageSize: 10,
            'Sorting.Field': 'createDate',
            'Sorting.Descending': true,
          },
        },
      )
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

      expect(commonApiGetMock).toHaveBeenCalledWith(
        `${API_PREFIXES.HISTORY}/activities/currentuser`,
        {
          params: {
            accountId: 123,
            pageNumber: 1,
            pageSize: 10,
            'Sorting.Field': 'createDate',
            'Sorting.Descending': true,
          },
        },
      )
    })
  })
})
