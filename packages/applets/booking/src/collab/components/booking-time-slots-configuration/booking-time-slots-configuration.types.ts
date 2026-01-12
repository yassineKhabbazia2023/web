import type { DayOfWeek } from './booking-time-slots-configuration.enums'

export interface TimeSlot {
  id: string
  day: DayOfWeek
  start: string
  end: string
}

export interface TimeSlotsConfiguration {
  timeSlots: TimeSlot[]
}
