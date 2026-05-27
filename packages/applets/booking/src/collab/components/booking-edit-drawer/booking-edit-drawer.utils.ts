import type { BookingConfigurationDetails, BookingConfigurationUpdatePayload, DayAvailability } from '@booking/types'
import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'
import type { TimeSlotsConfiguration, TimeSlot } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'

export function mapApiToAppointmentDetails(details: BookingConfigurationDetails): AppointmentDetails {
  return {
    name: details.displayName,
    description: details.description,
    location: '',
    isOnline: details.isOnline,
    duration: details.duration,
  }
}

export function mapApiToTimeSlotsConfiguration(details: BookingConfigurationDetails): TimeSlotsConfiguration {
  const timeSlots: TimeSlot[] = []

  for (const dayAvailability of details.availability) {
    for (const slot of dayAvailability.timeSlots) {
      timeSlots.push({
        day: dayAvailability.day,
        start: slot.start,
        end: slot.end,
      })
    }
  }

  return { timeSlots }
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export function mapToUpdatePayload(
  appointmentDetails: AppointmentDetails,
  timeSlotsConfiguration: TimeSlotsConfiguration,
): BookingConfigurationUpdatePayload {
  const availabilityMap = new Map<string, DayAvailability>()

  for (const slot of timeSlotsConfiguration.timeSlots) {
    if (availabilityMap.has(slot.day) === false) {
      availabilityMap.set(slot.day, {
        day: slot.day,
        timeSlots: [],
      })
    }
    const dayAvailability = availabilityMap.get(slot.day)
    if (dayAvailability !== undefined) {
      dayAvailability.timeSlots.push({
        start: slot.start,
        end: slot.end,
      })
    }
  }

  const availability = Array.from(availabilityMap.values()).sort((a, b) => {
    return DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  })

  for (const dayAvailability of availability) {
    dayAvailability.timeSlots.sort((a, b) => a.start.localeCompare(b.start))
  }

  return {
    displayName: appointmentDetails.name,
    description: appointmentDetails.description,
    isOnline: appointmentDetails.isOnline,
    duration: appointmentDetails.duration,
    availability,
  }
}
