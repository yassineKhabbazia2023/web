import { commonApi as api } from '@pulse/common'
import type { QueryResult } from '@pulse/common/types'
import { API_PREFIXES } from '@pulse/common/constants'
import type { BookingServiceConfiguration, BookingServiceExpert } from '../../types/booking.type'

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

  static async getBookingAvailableExperts({
    accountId,
    page = 1,
    pageSize = 3,
  } : {
    accountId: number
    page?: number
    pageSize?: number
  }) {
    const url = `${API_PREFIXES.BOOKING}/accounts/${accountId}/booking-link/currentuser/experts`
    const params = {
      page,
      pageSize,
    }
    const { data } = await api().gateway.get<QueryResult<BookingServiceExpert>>(url, {
      params,
    })

    return data.items ?? []
  }
}
