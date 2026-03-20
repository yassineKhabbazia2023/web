import dayjs from 'dayjs'
import { TIMEZONE } from '../../constants/timezone.const'

interface DateParts {
  year: string
  month: string
  day: string
}

/**
 * Extracts date parts (year, month, day) from a Date object in Paris timezone.
 * Uses fr-CA locale for ISO-like formatting (YYYY-MM-DD).
 */
export function getParisDateParts(date: Date): DateParts {
  const formatter = new Intl.DateTimeFormat('fr-CA', {
    timeZone: TIMEZONE.PARIS,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const [year, month, day] = formatter.format(date).split('-')
  return { year, month, day }
}

/**
 * Formats a Date to an ISO string representing the start of the day (00:00:00) in Paris timezone.
 * Example: 2024-01-15 -> "2024-01-15T00:00:00"
 */
export function formatStartDateToISO(date: Date): string {
  const { year, month, day } = getParisDateParts(date)
  return `${year}-${month}-${day}T00:00:00`
}

/**
 * Formats a Date to an ISO string representing the end of the day (23:59:59) in Paris timezone.
 * Example: 2024-01-15 -> "2024-01-15T23:59:59"
 */
export function formatEndDateToISO(date: Date): string {
  const { year, month, day } = getParisDateParts(date)
  return `${year}-${month}-${day}T23:59:59`
}

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

/**
 * Formats a date string to display only the time in HH:mm format.
 * @param dateString - ISO date string or any valid date string
 * @param locale - Locale for formatting (default: 'fr-FR')
 * @returns Formatted time string (e.g., "14:30")
 */
export function formatTime(dateString: string, locale: string = 'fr-FR'): string {
  const date = dayjs(dateString)
  if (date.isValid() === false) {
    return ''
  }
  return date.toDate().toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

/**
 * Formats a date string to display only day and month in DD/MM format.
 * @param dateString - ISO date string or any valid date string
 * @returns Formatted short date string (e.g., "15/03")
 */
export function formatShortDate(dateString: string): string {
  const date = dayjs(dateString)
  if (date.isValid() === false) {
    return ''
  }
  return date.format('DD/MM')
}

/**
 * Formats a date string to display date and time in locale format.
 * @param dateString - ISO date string or any valid date string
 * @param locale - Locale for formatting (default: 'fr-FR')
 * @returns Formatted date and time string (e.g., "15/03/2024 14:30")
 */
export function formatDateTime(dateString: string, locale: string = 'fr-FR'): string {
  const date = dayjs(dateString)
  if (date.isValid() === false) {
    return ''
  }
  return date.toDate().toLocaleString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
