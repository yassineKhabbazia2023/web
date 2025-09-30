import { commonApi as api } from '@pulse/common'
import { API_PREFIXES } from '@pulse/common/constants'
import { BookingServiceConfiguration } from './booking.service.type'

export class BookingService {
  private static readonly bookingApiUrl = `${API_PREFIXES.BOOKING}/booking-link/currentuser`

  static async createBookingConfiguration(configurationLink: string) {
    const payload = {
      link: configurationLink,
      isActive: true,
    }
    await api().gateway.post(BookingService.bookingApiUrl, payload)
  }

  static async getBookingConfiguration() {
    const { data } = await api().gateway.get<BookingServiceConfiguration>(BookingService.bookingApiUrl)

    return data
  }
}
