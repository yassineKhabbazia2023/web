import { formatTime, getMostRecentDate } from './dates.utils'

describe('getMostRecentDate', () => {
  it.each([
    ['2025-04-10', '2025-04-22', '2025-04-22'],
    ['2025-06-01', '2025-05-01', '2025-06-01'],
    ['2025-04-22', '2025-04-22', '2025-04-22'],
    [undefined, '2025-04-22', '2025-04-22'],
    ['2025-04-22', undefined, '2025-04-22'],
    ['', '2025-04-22', '2025-04-22'],
    ['2025-04-22', '', '2025-04-22'],
  ])('should return the more recent date between "%s" and "%s"', (date1, date2, expected) => {
    expect(getMostRecentDate(date1, date2)).toBe(expected)
  })

  it.each([
    ['invalid-date', '2025-04-22', '2025-04-22'],
    ['2025-04-10', 'bad-date', '2025-04-10'],
  ])('should return the valid date when only one is valid: "%s" and "%s"', (date1, date2, expected) => {
    expect(getMostRecentDate(date1, date2)).toBe(expected)
  })

  it.each([
    ['foo', 'bar'],
    ['not-a-date', 'still-not-a-date'],
    [undefined, 'bar'],
    ['foo', undefined],
    [undefined, undefined],
    ['', undefined],
  ])('should return undefined when both dates are invalid: "%s" and "%s"', (date1, date2) => {
    expect(getMostRecentDate(date1, date2)).toBeUndefined()
  })
})

describe('formatTime', () => {
  it('should format ISO date string to time HH:mm', () => {
    expect(formatTime('2024-03-15T14:30:00')).toBe('14:30')
  })

  it('should return empty string for invalid date', () => {
    expect(formatTime('invalid')).toBe('')
  })

  it('should use custom locale', () => {
    expect(formatTime('2024-03-15T14:30:00', 'en-US')).toBe('02:30 PM')
  })
})
