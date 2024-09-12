import { expect, describe, it } from 'vitest'
import {
  getDates,
  getMonthInterval,
  getAdvancedSearchParams,
  getSearchParams,
} from './ScheduleUtils'
import {
  getDoneDeadlinesByDateMock,
  getNotCompletelyDoneDeadlinesByDateMock,
} from '@/schedule/tests/mocks/Deadline'
import type { Filters } from '@/schedule/components/FilterDrawer/FilterDrawerTypes'

const TEST_DATE = '2024-08-14'

describe('test ScheduleUtils', () => {
  describe('getMonthInterval', () => {
    it('should return first and last month day', () => {
      const monthInterval = getMonthInterval(new Date(TEST_DATE), 0)
      const expectedMonthInterval = {
        startDate: `${TEST_DATE.substring(0, 8)}01`,
        endDate: `${TEST_DATE.substring(0, 8)}31`,
      }

      expect(monthInterval).toStrictEqual(expectedMonthInterval)
    })

    it('should return extended interval when extends interval is 7', () => {
      const monthInterval = getMonthInterval(new Date(TEST_DATE), 7)
      const expectedMonthInterval = {
        startDate: '2024-07-25',
        endDate: '2024-09-07',
      }

      expect(monthInterval).toStrictEqual(expectedMonthInterval)
    })
  })

  describe('getAdvancedSearchParams', () => {
    it('should return first and last month day', () => {
      const today = new Date(TEST_DATE)
      const searchTerm = 'abc'
      const filters: Filters = {
        targets: [],
        templates: ['Bilan'],
        status: [],
        mineOnly: true,
      }
      const searchParams = getAdvancedSearchParams(today, searchTerm, filters)
      const expectedSearchParams = {
        startDate: '2023-08-14',
        endDate: '2025-08-14',
        searchTerm,
        ...filters,
      }

      expect(searchParams).toStrictEqual(expectedSearchParams)
    })

    it('should return extended interval when extends interval is 7', () => {
      const monthInterval = getMonthInterval(new Date(TEST_DATE), 7)
      const expectedMonthInterval = {
        startDate: '2024-07-25',
        endDate: '2024-09-07',
      }

      expect(monthInterval).toStrictEqual(expectedMonthInterval)
    })
  })

  describe('getSearchParams', () => {
    it('should return first and last month day', () => {
      const today = new Date(TEST_DATE)
      const filters: Filters = {
        targets: [],
        templates: ['Bilan'],
        status: [],
        mineOnly: true,
      }
      const monthInterval = getSearchParams(today, filters)
      const expectedMonthInterval = {
        startDate: '2024-07-25',
        endDate: '2024-09-07',
        ...filters,
      }

      expect(monthInterval).toStrictEqual(expectedMonthInterval)
    })

    it('should return extended interval when extends interval is 7', () => {
      const monthInterval = getMonthInterval(new Date(TEST_DATE), 7)
      const expectedMonthInterval = {
        startDate: '2024-07-25',
        endDate: '2024-09-07',
      }

      expect(monthInterval).toStrictEqual(expectedMonthInterval)
    })
  })

  describe('getDates', () => {
    it('should return distinct dates', () => {
      const mockedDeadlinesByDate = [
        ...getDoneDeadlinesByDateMock(),
        ...getNotCompletelyDoneDeadlinesByDateMock(),
      ]
      const expectedDates = [
        mockedDeadlinesByDate[0].date,
        mockedDeadlinesByDate[1].date,
      ]
      const dates = getDates(mockedDeadlinesByDate)
      expect(dates).toStrictEqual(expectedDates)
    })
  })
})
