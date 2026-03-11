import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { logger } from '@pulse/toolbox'
import type {
  BookingAvailableExpertsResponse,
  BookingConfigurationPayload,
  BookingServiceConfiguration,
  BookingConfigurationResponse,
  BookingServiceExpert,
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
    const url = `${API_PREFIXES.BOOKING}/collaborators/currentuser`
    const { data } = await api.gateway.get<BookingAvailableExpertsResponse>(url)
    return data.collaborators
  }

  static async getBookingIframeUrl(collaboratorId: BookingServiceExpert['id']) {
    const url = `${API_PREFIXES.BOOKING}/collaborators/${collaboratorId}/booking-link/currentuser`
    const { data } = await api.gateway.get<string>(url)

    return data
  }

  static async submitBookingConfiguration(
    payload: BookingConfigurationPayload,
  ): Promise<BookingConfigurationResponse> {
    const url = `${API_PREFIXES.BOOKING}/booking/provisioning/currentuser`
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
