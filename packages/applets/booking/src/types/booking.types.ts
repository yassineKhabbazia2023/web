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
  id: number
  firstName: string
  lastName: string
}

export interface BookingAvailableExpertsResponse {
  collaborators: BookingServiceExpert[]
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

export interface AppointmentResponse {
  id: number
  startDateTime: string
  endDateTime: string
  subject: string
  counterpartName: string
  isOnlineMeeting: boolean
  joinWebUrl: string | null
  locationName: string | null
}

export interface AppointmentCountResponse {
  count: number
}

export interface BookingEnabledResponse {
  hasAccess: boolean
}

export interface BookingBusinessStatusResponse {
  configurationId: number | null
  status: string
}

export interface BookingConfigurationDetails {
  displayName: string
  description: string
  duration: number
  isOnline: boolean
  availability: DayAvailability[]
}

export type BookingConfigurationUpdatePayload = BookingConfigurationDetails
