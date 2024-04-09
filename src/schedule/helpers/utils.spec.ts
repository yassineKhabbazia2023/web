import {
  dateToLocaleFormat,
  accountsDataTransformer,
  dateISOFormatter,
  daysInTheMonth,
  getYearMonth,
} from './utils'
import { expect, describe, it } from 'vitest'
import { accountsCollectionForSelectFormat, accountsCollection } from '@/schedule/tests/mocks/Account'

const TEST_DATE = '2024-08-14'

describe('utils helpers', () => {
  it('should format date accordingly', () => {
    expect(dateToLocaleFormat(
      '2022-07-27T00:00:00')).toBe('27/07/2022')
  })
  it('should format date in iso standard whenever possible', () => {
    expect(dateISOFormatter(
      new Date('Wed Mar 20 2024 11:55:50 GMT+0100 (heure normale d’Europe centrale)')),
    ).toBe('2024-03-20')
    expect(dateISOFormatter('xxx'),
    ).toBe('')
    expect(dateISOFormatter(''),
    ).toBe('')
  })
  it('should format account data accordingly', () => {
    expect(accountsDataTransformer(accountsCollection)).toStrictEqual(
      accountsCollectionForSelectFormat,
    )
  })
  it('should return the number of days of the target month in specific year', () => {
    expect(daysInTheMonth(2024, 2)).toBe(29)
  })
  describe('getYearMonth', () => {
    it('should return proper year-month', () => {
      const yearMonth = getYearMonth(new Date(TEST_DATE))

      expect(yearMonth).toBe(TEST_DATE.substring(0, 7))
    })
  })
})
