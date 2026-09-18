import {
  formatCalendarDay,
  formatCalendarMonthYear,
  formatCalendarYear,
  formatInstant,
} from './date.utils'

/** The one an exercice closes on, which is the case the zone can break. */
const CLOSING_DATE = '2025-12-31'

/** A publication, west of midnight in Paris and east of it in Fort-de-France. */
const PUBLISHED_AT = '2026-01-02T09:00:00Z'

describe('key-moments dates', () => {

  describe('calendar dates', () => {

    it('should write a closing date in full', () => {
      expect(formatCalendarDay(CLOSING_DATE, 'fr-FR')).toBe('31/12/2025')
    })

    /**
     * The reason these are read in UTC: an ISO date alone is parsed as UTC
     * midnight, and rendered in a zone west of it a closing of the 31st would
     * be read as a closing of the 30th — and named on the wrong year.
     */
    it('should keep the day a closing date carries whatever the zone of the reader', () => {
      expect(formatCalendarDay(CLOSING_DATE, 'fr-FR')).toBe('31/12/2025')
      expect(formatCalendarYear(CLOSING_DATE, 'fr-FR')).toBe('2025')
      expect(formatCalendarMonthYear(CLOSING_DATE, 'fr-FR')).toBe('12/2025')
    })

    it('should name an exercice by the year it closes on', () => {
      expect(formatCalendarYear('2024-06-30', 'fr-FR')).toBe('2024')
    })

    it('should date a column by the month its exercise closes on', () => {
      expect(formatCalendarMonthYear('2024-06-30', 'fr-FR')).toBe('06/2024')
    })

    it('should write the date the way the locale asked for', () => {
      expect(formatCalendarDay(CLOSING_DATE, 'en-US')).toBe('12/31/2025')
    })

    /**
     * A calendar date is read in UTC even when it arrives as a full timestamp:
     * what the caller states is what the date is, not how it was written.
     */
    it('should read a timestamp given as a calendar date in UTC', () => {
      expect(formatCalendarDay('2025-12-31T23:30:00Z', 'fr-FR')).toBe('31/12/2025')
    })
  })

  describe('instants', () => {

    /**
     * The opposite rule: a publication happened at a point in time, and is read
     * on the calendar of whoever reads it — hence the local accessors here.
     */
    it('should read an instant in the zone of the reader', () => {
      const local = new Date(PUBLISHED_AT)
      const day = String(local.getDate()).padStart(2, '0')
      const month = String(local.getMonth() + 1).padStart(2, '0')

      expect(formatInstant(PUBLISHED_AT, 'fr-FR')).toBe(`${day}/${month}/${local.getFullYear()}`)
    })

    /** Omitting the locale is what an encart naming who wrote a text is read in. */
    it('should fall back on the locale of the reader', () => {
      expect(formatInstant(PUBLISHED_AT)).toBe(new Intl.DateTimeFormat().format(new Date(PUBLISHED_AT)))
    })
  })
})
