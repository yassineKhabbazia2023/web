/**
 * How the Moment Clé writes a date, in one place.
 *
 * Two families, and the whole point of stating them apart is the time zone. A
 * closing date, an exercice start, an exercice end are calendar dates: an ISO
 * date alone is parsed as UTC midnight, so it is rendered in UTC too — read in
 * the zone of the reader, a closing of the 31st falls back to the 30th in
 * Martinique, and its year with it. A publication instant is the opposite: it
 * happened at a point in time, and is read in the zone of whoever reads it.
 *
 * The locale is passed in rather than read here: the report carries the one it
 * was built with, which the export writes its deck in, and a formatter that
 * went looking for it itself would be a second source of truth.
 */

/** A calendar date, read in UTC — `31/12/2025`. */
export function formatCalendarDay(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(new Date(date))
}

/** The year a calendar date falls in, which is how an exercice is named. */
export function formatCalendarYear(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

/** The month a calendar date falls in — `12/2025`, how a column dates itself. */
export function formatCalendarMonthYear(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

/**
 * An instant, read in the zone of the reader: when a delivery was imported,
 * when a publication was made. An omitted locale is the reader's own, which is
 * what an encart naming who wrote a text and when is read in.
 */
export function formatInstant(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale).format(new Date(date))
}

/** An instant with its time of day — `21/08/2026 14:32`, when a comment was written. */
export function formatInstantWithTime(date: string, locale?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date))
}
