import dayjs from 'dayjs'

/**
 * Compares two date strings and returns the more recent one.
 * - If both dates are valid, returns the most recent.
 * - If only one is valid, returns the valid one.
 * - If neither date is valid, returns undefined.
 */
export function getMostRecentDate(dateStr1?: string, dateStr2?: string): string | undefined {
  const isValidDate1 = dateStr1 !== undefined && dayjs(dateStr1).isValid() === true
  const isValidDate2 = dateStr2 !== undefined && dayjs(dateStr2).isValid() === true

  if (isValidDate1 === false && isValidDate2 === false) {
    return
  }

  if (isValidDate1 === false) {
    return dateStr2
  }
  if (isValidDate2 === false) {
    return dateStr1
  }

  return dayjs(dateStr1).isAfter(dayjs(dateStr2)) ? dateStr1 : dateStr2
}
