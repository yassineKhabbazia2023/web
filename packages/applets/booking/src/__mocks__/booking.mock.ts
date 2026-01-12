import type { BookingServiceConfiguration, BookingServiceExpert } from '../types/booking.types'

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
    link: bookingLinkMock,
    fullName: 'Hugh Laurie',
    email: 'hl@test.ng',
  }

  return {
    ...bookingServiceExpert,
    ...overridden,
  }
}
