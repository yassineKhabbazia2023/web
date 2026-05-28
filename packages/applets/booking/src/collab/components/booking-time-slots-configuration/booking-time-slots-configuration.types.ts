import type { DayOfWeek } from './booking-time-slots-configuration.enums'

export interface TimeSlot {
  day: DayOfWeek
  start: string
  end: string
}

export interface TimeSlotsConfiguration {
  timeSlots: TimeSlot[]
}
