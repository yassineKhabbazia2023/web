import { getDateType } from './PCalendarUtils'

describe('test PCalendarUtils', () => {
  describe('getDateType', () => {
    const YEAR = 2024
    const MONTH = 5

    const DATE_RANGE: [Date, Date] = [
      new Date(YEAR, MONTH, 1),
      new Date(YEAR, MONTH, 31),
    ]
    const tests = [{
      dateRange: undefined,
      date: new Date(YEAR, MONTH - 2, 1),
      nativeDateType: 'current-month',
      expected: 'current-month',
      reason: 'no date range given',
    }, {
      dateRange: undefined,
      date: new Date(YEAR, MONTH, 1),
      nativeDateType: 'unexpected-type',
      expected: 'current-month',
      reason: 'native date type is unknown',
    }, {
      dateRange: DATE_RANGE,
      date: new Date(YEAR, MONTH, 1),
      nativeDateType: 'prev-month',
      expected: 'current-month',
      reason: 'date at begining of dateRange',
    }, {
      dateRange: DATE_RANGE,
      date: new Date(YEAR, MONTH, 2),
      nativeDateType: 'prev-month',
      expected: 'current-month',
      reason: 'date is inside dateRange',
    }, {
      dateRange: DATE_RANGE,
      date: new Date(YEAR, MONTH - 1, 30),
      nativeDateType: 'current-month',
      expected: 'prev-month',
      reason: 'date is before dateRange',
    }, {
      dateRange: DATE_RANGE,
      date: new Date(YEAR, MONTH + 1, 2),
      nativeDateType: 'current-month',
      expected: 'next-month',
      reason: 'date is after dateRange',
    }]
    it.each(tests)('should return $exected when $reason', ({
      dateRange,
      date,
      nativeDateType,
      expected,
    }) => {
      const dateType = getDateType(dateRange, date, nativeDateType)
      expect(dateType).toBe(expected)
    })
  })
})
