import { expect, describe, it } from 'vitest'
import {
  getDates,
  getMonthInterval,
  getAdvancedSearchParams,
} from './ScheduleUtils'
import {
  getDoneDeadlinesByDateMock,
  getNotCompletelyDoneDeadlinesByDateMock,
} from '@/schedule/tests/mocks/Deadline'

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
      const monthInterval = getAdvancedSearchParams(today, searchTerm)
      const expectedMonthInterval = {
        startDate: '2023-08-14',
        endDate: '2025-08-14',
        searchTerm,
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
