import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import { BookingService } from './booking.service'
import type { BookingConfigurationResponse, BookingConfigurationPayload } from '../types/booking.types'
import { getMockedBookingServiceConfiguration } from '../__mocks__'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

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

  // TODO: Restore API tests when removing mock data from service
  describe('getBookingAvailableExperts', () => {
    it('should return mocked experts', async () => {
      const experts = await BookingService.getBookingAvailableExperts()

      expect(experts).toHaveLength(3)
      expect(experts[0]).toEqual({
        contactId: 1,
        iframeUrl: 'https://outlook.office.com/book/BookingAmauryLinde@conseilescgs.com/?ismsaljsauthenabled&lang=fr-FR',
        fullName: 'Amaury Linde',
        email: 'amaury.linde@conseilescgs.com',
      })
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
      const expectedUrl = `${API_PREFIXES.BOOKING}/booking-link/currentuser/configuration`
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
})
