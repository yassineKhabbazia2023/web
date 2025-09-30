import { apiGatewayMock } from '@pulse/common/mocks'
import { API_PREFIXES } from '@pulse/common/constants'
import { BookingService } from './booking.service'
import { getMockedBookingServiceConfiguration } from '@app/__mocks__/booking.mock'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

const bookingServiceConfigurationMock = getMockedBookingServiceConfiguration()

describe('booking.service', () => {
  it('createBookingConfiguration', async () => {
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

  it('getBookingConfiguration', async () => {
    const expectedUrl = `${API_PREFIXES.BOOKING}/booking-link/currentuser`
    const expectedbookingServiceConfiguration = bookingServiceConfigurationMock

    apiGatewayMock.get.mockResolvedValue({
      data: bookingServiceConfigurationMock,
    })
    const bookingServiceConfiguration = await BookingService.getBookingConfiguration()

    expect(apiGatewayMock.get).toHaveBeenCalled()
    expect(apiGatewayMock.get).toHaveBeenCalledWith(expectedUrl)
    expect(bookingServiceConfiguration).toStrictEqual(expectedbookingServiceConfiguration)
  })
})
