import { expect, describe, it } from 'vitest'
import {
  getMonthInterval,
} from './ScheduleUtils'

const TEST_DATE = '2024-08-14'

describe('test ScheduleUtils', () => {
  describe('getMonthInterval', () => {
    it('should return first and last month day', () => {
      const monthInterval = getMonthInterval(new Date(TEST_DATE))
      const expectedMonthInterval = {
        startDate: `${TEST_DATE.substring(0, 8)}01`,
        endDate: `${TEST_DATE.substring(0, 8)}31`,
      }

      expect(monthInterval).toStrictEqual(expectedMonthInterval)
    })
  })
})
