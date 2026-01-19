import type { DayOfWeek } from '../collab/components/booking-time-slots-configuration/booking-time-slots-configuration.enums'

// Simplified types for backend gateway
// MS Graph specific formatting is handled by the backend

export interface BookingServiceConfiguration {
  contactId: number
  link: string
  isActive: boolean
  creationDate: string
  updatedDate: string
}

export interface BookingServiceExpert {
  contactId: number
  iframeUrl: string
  fullName: string
  email: string
}

export interface BookingConfigurationResponse {
  id: string
  displayName: string
}

export interface SimpleTimeSlot {
  start: string // Format "HH:mm"
  end: string // Format "HH:mm"
}

export interface DayAvailability {
  day: DayOfWeek
  timeSlots: SimpleTimeSlot[]
}

export interface BookingConfigurationPayload {
  displayName: string
  description?: string
  location?: string
  isOnline: boolean
  duration: number // minutes (30, 60, 90, 120)
  availability: DayAvailability[]
}
