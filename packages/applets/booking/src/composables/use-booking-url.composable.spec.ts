import { useBookingUrl } from './use-booking-url.composable'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedUser } from '@pulse/common/mocks'
import { BookingRedirectAction } from '@booking/enums/booking-redirect-action.enums'
import { BOOKING_QUERY_PARAM_COLLABORATOR_ID } from '@booking/constants/booking.const'

const userStoreMock = getStoreMock(useUserStore)

describe('useBookingUrl', () => {
  beforeEach(() => {
    userStoreMock.user = getMockedUser({ id: 123 })
  })

  describe('bookingUrl', () => {
    it('should return empty string when user is undefined', () => {
      userStoreMock.user = undefined

      const { bookingUrl } = useBookingUrl()

      expect(bookingUrl.value).toBe('')
    })

    it('should return empty string when user ID is undefined', () => {
      userStoreMock.user = getMockedUser({ id: undefined })

      const { bookingUrl } = useBookingUrl()

      expect(bookingUrl.value).toBe('')
    })

    it('should build correct URL with user ID', () => {
      userStoreMock.user = getMockedUser({ id: 456 })

      const { bookingUrl } = useBookingUrl()

      const expectedParams = new URLSearchParams()
      expectedParams.set('action', BookingRedirectAction.OPEN_BOOKING_WIDGET)
      expectedParams.set(BOOKING_QUERY_PARAM_COLLABORATOR_ID, '456')
      const expectedUrl = `${globalThis.window.location.origin}/redirect?${expectedParams.toString()}`

      expect(bookingUrl.value).toBe(expectedUrl)
    })

    it('should contain redirect action parameter', () => {
      const { bookingUrl } = useBookingUrl()

      expect(bookingUrl.value).toContain('action=open-booking-widget')
    })

    it('should contain collaborator ID parameter', () => {
      userStoreMock.user = getMockedUser({ id: 789 })

      const { bookingUrl } = useBookingUrl()

      expect(bookingUrl.value).toContain('collaboratorId=789')
    })

    it('should start with origin and redirect path', () => {
      const { bookingUrl } = useBookingUrl()

      expect(bookingUrl.value).toMatch(/^.*\/redirect\?/)
    })
  })
})
