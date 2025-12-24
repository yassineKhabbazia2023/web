import { getMockedQueryResult, getMockedBookingServiceConfiguration, getBookingServiceExpert } from '@pulse/common/mocks'
import { apiGatewayMock } from '@pulse/common/mocks/vitest'
import { API_PREFIXES } from '@pulse/common/constants'
import type { BookingServiceExpert } from '../../types/booking.type'

import { BookingService } from './booking.service'

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: apiGatewayMock,
  }),
}))

const bookingServiceConfigurationMock = getMockedBookingServiceConfiguration()
const accountId = 2312
const expertsMock = [
  getBookingServiceExpert(),
]

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
    it('shoud call api properly', async () => {
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
    const tests = [{
      params: {
        accountId,
        page: 3,
        pageSize: 10,
      },
      expectedUrl: `${API_PREFIXES.BOOKING}/accounts/${accountId}/booking-link/currentuser/experts`,
      expectedParams: {
        page: 3,
        pageSize: 10,
      },
      description: 'when giving page and pageSize, should use given values',
    }, {
      params: {
        accountId,
      },
      expectedUrl: `${API_PREFIXES.BOOKING}/accounts/${accountId}/booking-link/currentuser/experts`,
      expectedParams: {
        page: 1,
        pageSize: 3,
      },
      description: 'when not giving page and pageSize, should use default values',
    }]
    it.each(tests)('should call api properly $description', async ({
      params,
      expectedUrl,
      expectedParams,
    }) => {
      const expectedParameters = {
        params: expectedParams,
      }
      apiGatewayMock.get.mockResolvedValue({
        data: getMockedQueryResult<BookingServiceExpert>({
          items: expertsMock,
        }),
      })
      const experts = await BookingService.getBookingAvailableExperts(params)

      expect(apiGatewayMock.get).toHaveBeenCalledExactlyOnceWith(expectedUrl, expectedParameters)
      expect(experts).toStrictEqual(expertsMock)
    })
  })
})
