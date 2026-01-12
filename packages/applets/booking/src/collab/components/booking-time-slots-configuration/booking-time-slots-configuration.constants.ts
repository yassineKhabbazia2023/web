import type { DayOfWeek } from './booking-time-slots-configuration.enums'

/**
 * Default time slot values
 */
export const DEFAULT_MORNING_SLOT_START = '09:00'
export const DEFAULT_MORNING_SLOT_END = '12:30'
export const DEFAULT_AFTERNOON_SLOT_START = '14:30'
export const DEFAULT_AFTERNOON_SLOT_END = '18:00'

/**
 * Time slot interval in minutes for the time picker options
 */
export const TIME_SLOT_INTERVAL_MINUTES = 15

/**
 * Days of the week available for booking
 */
export const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
