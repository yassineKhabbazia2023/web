import { api } from '@pulse/common/api'
import { API_PREFIXES } from '@pulse/common/constants'
import { logger } from '@pulse/toolbox'
import type {
  AppointmentCountResponse,
  AppointmentResponse,
  BookingAvailableExpertsResponse,
  BookingConfigurationPayload,
  BookingServiceConfiguration,
  BookingConfigurationResponse,
  BookingServiceExpert,
  BookingEnabledResponse,
  BookingBusinessStatusResponse,
  BookingConfigurationDetails,
  BookingConfigurationUpdatePayload,
} from '../types/booking.types'

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

  static async getUpcomingAppointments(limit = 10): Promise<AppointmentResponse[]> {
    const url = `${API_PREFIXES.BOOKING}/appointments/upcoming/currentuser`
    const { data } = await api.gateway.get<AppointmentResponse[]>(url, {
      params: { limit },
    })
    return data
  }

  static async getPastAppointments(limit = 10): Promise<AppointmentResponse[]> {
    const url = `${API_PREFIXES.BOOKING}/appointments/past/currentuser`
    const { data } = await api.gateway.get<AppointmentResponse[]>(url, {
      params: { limit },
    })
    return data
  }

  static async getUpcomingAppointmentsCount(): Promise<number> {
    const url = `${API_PREFIXES.BOOKING}/appointments/upcoming/count/currentuser`
    const { data } = await api.gateway.get<AppointmentCountResponse>(url)
    return data.count
  }

  static async getBookingBusinessStatus(): Promise<BookingBusinessStatusResponse> {
    const url = `${API_PREFIXES.BOOKING}/booking/businesses/status/currentuser`
    const { data } = await api.gateway.get<BookingBusinessStatusResponse>(url)
    return data
  }

  static async getBookingConfigurationDetails(configurationId: number): Promise<BookingConfigurationDetails> {
    const url = `${API_PREFIXES.BOOKING}/businesses/${configurationId}/currentuser`
    const { data } = await api.gateway.get<BookingConfigurationDetails>(url)
    return data
  }

  static async updateBookingConfiguration(
    configurationId: number,
    payload: BookingConfigurationUpdatePayload,
  ): Promise<void> {
    const url = `${API_PREFIXES.BOOKING}/booking/businesses/${configurationId}/services/currentuser`
    await api.gateway.patch(url, payload)
  }
}
