import { loggerMock } from '@pulse/toolbox/mocks'
import { BookingManager } from './booking.manager'
import { BookingService } from '@pulse/common/services/booking'
import { useUserStore, useCurrentEntityStore, useBookingCustomerStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature } from '@pulse/common/enums'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import type { BookingServiceExpert } from '@pulse/common/types'

const mockExperts: BookingServiceExpert[] = [
  {
    contactId: 1,
    fullName: 'John Doe',
    link: 'http://example.com/johndoe',
    email: 'john.doe@example.com',
  },
  {
    contactId: 2,
    fullName: 'Jane Smith',
    link: 'http://example.com/janesmith',
    email: 'jane.smith@example.com',
  },
]

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const bookingStoreMock = getStoreMock(useBookingCustomerStore)

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

describe('BookingManager', () => {

  beforeEach(() => {
    // Reset store mocks to default state
    userStoreMock.isCollab = false
    currentEntityStoreMock.currentEntityId = undefined

    vi.spyOn(BookingService, 'getBookingAvailableExperts')
    vi.spyOn(FeatureFlagManager, 'isFeatureActivated')
    vi.spyOn(logger, 'error')
  })

  describe('refreshAvailableExperts', () => {
    it('should load and set available experts when user is client, entity is selected, and feature is activated', async () => {
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = 123
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(true)
      vi.mocked(BookingService.getBookingAvailableExperts).mockResolvedValue(mockExperts)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).toHaveBeenCalledWith({
        accountId: 123,
      })
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith(mockExperts)
    })

    it('should set empty array when user is collab', async () => {
      userStoreMock.isCollab = true
      currentEntityStoreMock.currentEntityId = 123
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(true)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should set empty array when no entity is selected', async () => {
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = undefined
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(true)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should set empty array when booking feature is not activated', async () => {
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = 123
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(false)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
      expect(FeatureFlagManager.isFeatureActivated).toHaveBeenCalledWith(Feature.BOOKING)
    })

    it('should handle errors and set empty array when service fails', async () => {
      const mockError = new Error('API error')
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = 123
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(true)
      vi.mocked(BookingService.getBookingAvailableExperts).mockRejectedValue(mockError)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).toHaveBeenCalledWith({
        accountId: 123,
      })
      expect(logger.error).toHaveBeenCalledWith(mockError)
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })
  })
})
