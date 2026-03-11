import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { loggerMock } from '@pulse/toolbox/mocks'
import { API_PREFIXES } from '@pulse/common/constants'
import { BookingService } from './booking.service'
import type { BookingConfigurationResponse, BookingConfigurationPayload } from '../types/booking.types'
import { getMockedBookingServiceConfiguration, getMockExperts } from '../__mocks__'

vi.mock('@pulse/common/api', () => ({
  api: {
    gateway: apiGatewayMock,
  },
}))

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const bookingServiceConfigurationMock = getMockedBookingServiceConfiguration()

describe('booking.service', () => {
  describe('createBookingConfiguration', () => {
    it('should call api properly', async () => {
      const configurationLink = 'https://example.com/config-link'
      const expectedUrl = `${API_PREFIXES.BOOKING}/booking-link/currentuser`
      const expectedPayload = {
        link: configurationLink,
        isActive: true,
      }

      await BookingService.createBookingConfiguration(configurationLink)

      expect(apiGatewayMock.post).toHaveBeenCalled()
      expect(apiGatewayMock.post).toHaveBeenCalledWith(expectedUrl, expectedPayload)
    })
  })

  describe('getBookingConfiguration', () => {
    it('should call api properly', async () => {
      const expectedUrl = `${API_PREFIXES.BOOKING}/booking-link/currentuser`
      const expectedbookingServiceConfiguration = bookingServiceConfigurationMock

      apiGatewayMock.get.mockResolvedValue({
        data: bookingServiceConfigurationMock,
      })
      const bookingServiceConfiguration = await BookingService.getBookingConfiguration()

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
      expect(bookingServiceConfiguration).toStrictEqual(expectedbookingServiceConfiguration)
    })
  })

  describe('getBookingAvailableExperts', () => {
    it('should call api and return collaborators', async () => {
      const expectedUrl = `${API_PREFIXES.BOOKING}/collaborators/currentuser`
      const mockExperts = getMockExperts()

      apiGatewayMock.get.mockResolvedValue({
        data: { collaborators: mockExperts },
      })

      const experts = await BookingService.getBookingAvailableExperts()

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
      expect(experts).toEqual(mockExperts)
    })
  })

  describe('getBookingIframeUrl', () => {
    it('should call api and return iframe url', async () => {
      const collaboratorId = 42
      const expectedUrl = `${API_PREFIXES.BOOKING}/collaborators/${collaboratorId}/booking-link/currentuser`
      const mockIframeUrl = 'https://outlook.office.com/booking/test'

      apiGatewayMock.get.mockResolvedValue({ data: mockIframeUrl })

      const result = await BookingService.getBookingIframeUrl(collaboratorId)

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
      expect(result).toBe(mockIframeUrl)
    })
  })

  describe('submitBookingConfiguration', () => {
    it('should call api properly', async () => {
      const payload: BookingConfigurationPayload = {
        displayName: 'Test Meeting',
        description: 'Test description',
        isOnline: true,
        duration: 30,
        availability: [],
      }
      const expectedUrl = `${API_PREFIXES.BOOKING}/booking/provisioning/currentuser`
      const mockResponse: BookingConfigurationResponse = {
        id: '123',
        displayName: 'Test Meeting',
      }

      apiGatewayMock.post.mockResolvedValue({ data: mockResponse })

      const result = await BookingService.submitBookingConfiguration(payload)

      expect(apiGatewayMock.post).toHaveBeenCalledExactlyOnceWith(expectedUrl, payload)
      expect(result).toStrictEqual(mockResponse)
    })
  })

  describe('getBookingEnabledFlag', () => {
    const expectedUrl = `${API_PREFIXES.BOOKING}/enabled/currentuser`

    it('should return true when API returns hasAccess true', async () => {
      apiGatewayMock.get.mockResolvedValueOnce({ data: { hasAccess: true } })

      const result = await BookingService.getBookingEnabledFlag()

      expect(result).toBe(true)
      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl)
    })

    it('should return false when API returns hasAccess false', async () => {
      apiGatewayMock.get.mockResolvedValueOnce({ data: { hasAccess: false } })

      const result = await BookingService.getBookingEnabledFlag()

      expect(result).toBe(false)
    })

    it('should return false on API error', async () => {
      const error = new Error('Network error')
      apiGatewayMock.get.mockRejectedValueOnce(error)

      const result = await BookingService.getBookingEnabledFlag()

      expect(result).toBe(false)
      expect(loggerMock.error).toHaveBeenCalledWith(error)
    })
  })
})
