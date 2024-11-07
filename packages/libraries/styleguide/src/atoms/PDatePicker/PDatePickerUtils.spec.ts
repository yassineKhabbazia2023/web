import { describe, it, expect, vi } from 'vitest'
import { getCurrentDate, getWeekCount } from './PDatePickerUtils'
import type { PDatePickerModelValue } from './PDatePickerTypes'

const MONTHES = {
  february: '02',
  may: '05',
  december: '12',
}

const TODAY = '2024-07-09'
const mockedToday = new Date(TODAY)
vi.setSystemTime(mockedToday)

describe('test PDatePickerUtils', () => {
  describe('getCurrentDate', () => {
    const date1 = new Date('2024-02-01')
    const date2 = new Date('2024-03-25')
    const date3 = new Date('2024-05-13')
    const tests: {
      modelValue: PDatePickerModelValue | undefined
      panelDate: PDatePickerModelValue | undefined
      expected: Date
      reason: string
    }[] = [{
      modelValue: undefined,
      panelDate: undefined,
      expected: mockedToday,
      reason: 'currentDate and panelDate are undefined',
    }, {
      modelValue: date1,
      panelDate: undefined,
      expected: date1,
      reason: 'panelDate is undefined',
    }, {
      modelValue: date1,
      panelDate: date2,
      expected: date2,
      reason: 'panelDate is given',
    }, {
      modelValue: date1,
      panelDate: [date2, date3],
      expected: date1,
      reason: 'panelDate is given but is an array',
    }, {
      modelValue: [date1, date3],
      panelDate: undefined,
      expected: mockedToday,
      reason: 'currentDate is an array and panelDate is undefined',
    }, {
      modelValue: [date1, date3],
      panelDate: [date2, date3],
      expected: mockedToday,
      reason: 'currentDate and panelDate are given but are arrays',
    }]
    it.each(tests)('should return $expected when $reason', ({
      modelValue,
      panelDate,
      expected,
    }) => {
      const currentDate = getCurrentDate(modelValue, panelDate)
      expect(currentDate).toStrictEqual(expected)
    })
  })

  describe('getWeekCount', () => {
    const tests = [{
      year: 2024,
      month: MONTHES.december,
      expected: 6,
      reason: '31 days in december 2024 starting on sunday',
    }, {
      year: 2027,
      month: MONTHES.may,
      expected: 6,
      reason: '31 days in may 2027 starting on saturday',
    }, {
      year: 2024,
      month: MONTHES.february,
      expected: 5,
      reason: '29 days in february 2024 starting on thursday',
    }, {
      year: 2025,
      month: MONTHES.february,
      expected: 5,
      reason: '28 days in february 2025 starting on saturday',
    }, {
      year: 2027,
      month: MONTHES.february,
      expected: 4,
      reason: '28 days in february 2027 starting on monday',
    }]
    it.each(tests)('should return $expected when $reason', ({
      year,
      month,
      expected,
    }) => {
      const currentDate = new Date(`${year}-${month}-02`)
      const weekCount = getWeekCount(currentDate)
      expect(weekCount).toBe(expected)
    })
  })
})
