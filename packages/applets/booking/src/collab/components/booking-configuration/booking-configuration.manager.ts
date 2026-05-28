import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'
import type { TimeSlot, TimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'
import type { DayOfWeek } from '../booking-time-slots-configuration/booking-time-slots-configuration.enums'
import type {
  BookingConfigurationPayload,
  DayAvailability,
  SimpleTimeSlot,
} from '../../../types/booking.types'

export class BookingConfigurationManager {
  // Groups time slots by day
  static groupTimeSlotsByDay(slots: TimeSlot[]): DayAvailability[] {
    const slotsByDay = new Map<DayOfWeek, SimpleTimeSlot[]>()

    for (const slot of slots) {
      const day = slot.day
      const existingSlots = slotsByDay.get(day) ?? []
      existingSlots.push({
        start: slot.start,
        end: slot.end,
      })
      slotsByDay.set(day, existingSlots)
    }

    const result: DayAvailability[] = []
    for (const [day, timeSlots] of slotsByDay) {
      result.push({ day, timeSlots })
    }

    return result
  }

  // Builds the booking configuration payload from form data
  static prepareMeetingTemplatePayload(
    appointment: AppointmentDetails,
    timeSlotsConfig: TimeSlotsConfiguration,
  ): BookingConfigurationPayload {
    const hasDescription = appointment.description.trim().length > 0
    const hasLocation = appointment.location.trim().length > 0

    return {
      displayName: appointment.name,
      description: hasDescription ? appointment.description : undefined,
      location: hasLocation ? appointment.location : undefined,
      isOnline: appointment.isOnline,
      duration: appointment.duration,
      availability: BookingConfigurationManager.groupTimeSlotsByDay(timeSlotsConfig.timeSlots),
    }
  }
}
