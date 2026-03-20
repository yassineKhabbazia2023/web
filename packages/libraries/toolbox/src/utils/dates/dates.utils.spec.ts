import {
  formatDateTime,
  formatEndDateToISO,
  formatShortDate,
  formatStartDateToISO,
  formatTime,
  getMostRecentDate,
  getParisDateParts,
} from './dates.utils'

describe('getParisDateParts', () => {
  it('should return correct date parts for a given date', () => {
    const date = new Date('2024-03-15T10:30:00Z')
    const result = getParisDateParts(date)

    expect(result.year).toBe('2024')
    expect(result.month).toBe('03')
    expect(result.day).toBe('15')
  })

  it('should handle dates at midnight UTC', () => {
    const date = new Date('2024-01-01T00:00:00Z')
    const result = getParisDateParts(date)

    expect(result.year).toBe('2024')
    expect(result.month).toBe('01')
    expect(result.day).toBe('01')
  })
})

describe('formatStartDateToISO', () => {
  it('should format date with start of day time', () => {
    const date = new Date('2024-03-15T14:30:00')
    const result = formatStartDateToISO(date)

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00$/)
    expect(result).toContain('T00:00:00')
  })

  it('should handle end of year dates', () => {
    const date = new Date('2024-12-31T23:59:59')
    const result = formatStartDateToISO(date)

    expect(result).toContain('T00:00:00')
  })
})

describe('formatEndDateToISO', () => {
  it('should format date with end of day time', () => {
    const date = new Date('2024-03-15T14:30:00')
    const result = formatEndDateToISO(date)

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T23:59:59$/)
    expect(result).toContain('T23:59:59')
  })

  it('should handle start of year dates', () => {
    const date = new Date('2024-01-01T00:00:00')
    const result = formatEndDateToISO(date)

    expect(result).toContain('T23:59:59')
  })
})

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

describe('formatShortDate', () => {
  it('should format ISO date string to DD/MM format', () => {
    expect(formatShortDate('2024-03-15T14:30:00')).toBe('15/03')
  })

  it('should return empty string for invalid date', () => {
    expect(formatShortDate('invalid')).toBe('')
  })

  it('should handle single digit day and month with zero padding', () => {
    expect(formatShortDate('2024-01-05T10:00:00')).toBe('05/01')
  })

  it('should handle end of year date', () => {
    expect(formatShortDate('2024-12-31T23:59:59')).toBe('31/12')
  })
})

describe('formatDateTime', () => {
  it('should format ISO date string to date and time', () => {
    expect(formatDateTime('2024-03-15T14:30:00')).toBe('15/03/2024 14:30')
  })

  it('should return empty string for invalid date', () => {
    expect(formatDateTime('invalid')).toBe('')
  })

  it('should use custom locale', () => {
    expect(formatDateTime('2024-03-15T14:30:00', 'en-US')).toMatch(/3\/15\/2024/)
  })

  it('should handle timezone in ISO string', () => {
    const result = formatDateTime('2024-03-15T14:30:00Z')
    expect(result).toContain('15/03/2024')
  })
})
