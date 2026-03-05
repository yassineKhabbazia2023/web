import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { logger } from '@pulse/toolbox'
import type {
  BookingConfigurationPayload,
  BookingServiceConfiguration,
  BookingServiceExpert,
  BookingConfigurationResponse,
} from '../types/booking.types'
import type { BookingEnabledResponse } from '../types/booking-enabled.type'

export class BookingService {
  private static readonly bookingApiUrl = `${API_PREFIXES.BOOKING}/booking-link/currentuser`

  static async createBookingConfiguration(configurationLink: string) {
    const payload = {
      link: configurationLink,
      isActive: true,
    }
    await api.gateway.post(BookingService.bookingApiUrl, payload)
  }

  static async getBookingConfiguration() {
    const { data } = await api.gateway.get<BookingServiceConfiguration>(BookingService.bookingApiUrl)

    return data
  }

  static async getBookingAvailableExperts() {
    // TODO: Remove mock data and restore API call
    const sharedPageUrl = 'https://outlook.office.com/book/BookingAmauryLinde@conseilescgs.com/?ismsaljsauthenabled&lang=fr-FR'
    const mockedExperts: BookingServiceExpert[] = [
      {
        contactId: 1,
        iframeUrl: sharedPageUrl,
        fullName: 'Amaury Linde',
        email: 'amaury.linde@conseilescgs.com',
      },
      {
        contactId: 2,
        iframeUrl: sharedPageUrl,
        fullName: 'Jean Dupont',
        email: 'jean.dupont@conseilescgs.com',
      },
      {
        contactId: 3,
        iframeUrl: sharedPageUrl,
        fullName: 'Marie Martin',
        email: 'marie.martin@conseilescgs.com',
      },
    ]

    return mockedExperts

    // Original API call (commented out for now)
    // const url = `${API_PREFIXES.BOOKING}/accounts/${accountId}/booking-link/currentuser/experts`
    // const params = {
    //   page,
    //   pageSize,
    // }
    // const { data } = await api().gateway.get<QueryResult<BookingServiceExpert>>(url, {
    //   params,
    // })
    // return data.items ?? []
  }

  static async submitBookingConfiguration(
    payload: BookingConfigurationPayload,
  ): Promise<BookingConfigurationResponse> {
    const url = `${API_PREFIXES.BOOKING}/booking-link/currentuser/configuration`
    const { data } = await api.gateway.post<BookingConfigurationResponse>(url, payload)

    return data
  }

  static async getBookingEnabledFlag(): Promise<boolean> {
    const url = `${API_PREFIXES.BOOKING}/enabled/currentuser`

    try {
      const { data } = await api.gateway.get<BookingEnabledResponse>(url)
      return data.hasAccess === true
    } catch (error) {
      logger.error(error)
      return false
    }
  }
}
