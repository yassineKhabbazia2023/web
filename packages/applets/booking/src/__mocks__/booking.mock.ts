import type {
  BookingServiceConfiguration,
  BookingServiceExpert,
  BookingConfigurationPayload,
  BookingConfigurationResponse,
} from '@booking/types/booking.types'
import type { TimeSlotsConfiguration } from '@booking/collab/components/booking-time-slots-configuration/booking-time-slots-configuration.types'
import type { AppointmentDetails } from '@booking/collab/components/booking-appointment-configuration/booking-appointment-configuration.types'

export const bookingLinkMock = 'https://outlook.office.com/bookwithme/user/206b1d956a484d488fdbf896f418e0f9@rydge.fr/meetingtype/zuolSkK_lEqt1HhFDPJP1w2?anonymous&ismsaljsauthenabled&ep=mlink'

export function getMockedBookingServiceConfiguration(overridden: Partial<BookingServiceConfiguration> = {}) {
  const bookingServiceConfiguration: BookingServiceConfiguration = {
    contactId: 0,
    link: bookingLinkMock,
    isActive: true,
    creationDate: '2025-09-26T08:13:34.432Z',
    updatedDate: '2025-09-26T08:13:34.432Z',
  }

  return {
    ...bookingServiceConfiguration,
    ...overridden,
  }
}

export function getBookingServiceExpert(overridden: Partial<BookingServiceExpert> = {}) {
  const bookingServiceExpert: BookingServiceExpert = {
    contactId: 0,
    iframeUrl: bookingLinkMock,
    fullName: 'Hugh Laurie',
    email: 'hl@test.ng',
  }

  return {
    ...bookingServiceExpert,
    ...overridden,
  }
}

export function getMockedTimeSlotsConfiguration(
  overridden: Partial<TimeSlotsConfiguration> = {},
): TimeSlotsConfiguration {
  const timeSlotsConfiguration: TimeSlotsConfiguration = {
    timeSlots: [],
  }

  return {
    ...timeSlotsConfiguration,
    ...overridden,
  }
}

export function getMockedBookingConfigurationPayload(
  overridden: Partial<BookingConfigurationPayload> = {},
): BookingConfigurationPayload {
  const payload: BookingConfigurationPayload = {
    displayName: 'Test Meeting',
    isOnline: false,
    duration: 30,
    availability: [],
  }

  return {
    ...payload,
    ...overridden,
  }
}

export function getMockedBookingConfigurationResponse(
  overridden: Partial<BookingConfigurationResponse> = {},
): BookingConfigurationResponse {
  const response: BookingConfigurationResponse = {
    id: '123',
    displayName: 'Test Meeting',
  }

  return {
    ...response,
    ...overridden,
  }
}

export function getMockedAppointmentDetails(overridden: Partial<AppointmentDetails> = {}): AppointmentDetails {
  const appointmentDetails: AppointmentDetails = {
    name: 'Test Meeting',
    description: 'Test Description',
    location: 'Test Location',
    isOnline: true,
    duration: 60,
  }

  return {
    ...appointmentDetails,
    ...overridden,
  }
}
