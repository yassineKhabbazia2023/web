import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookingManager } from './booking.manager'
import { BookingService } from '../../services/booking/booking.service'
import { useUserStore } from '../../stores/user/user.store'
import { useSelectedEntityStore } from '../../stores/selected-entity/selected-entity.store'
import { useBookingStore } from '../../stores/booking/booking.store'
import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature } from '@pulse/common/enums'
import { getStoreMock } from '@pulse/common/mocks'
import type { BookingServiceExpert } from '../../types/booking.type'

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
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
const bookingStoreMock = getStoreMock(useBookingStore)

describe('BookingManager', () => {

  beforeEach(() => {
    // Reset store mocks to default state
    userStoreMock.isCollab = false
    selectedEntityStoreMock.selectedEntityId = undefined

    vi.spyOn(BookingService, 'getBookingAvailableExperts')
    vi.spyOn(FeatureFlagManager, 'isFeatureActivated')
    vi.spyOn(logger, 'error')
  })

  describe('refreshAvailableExperts', () => {
    it('should load and set available experts when user is client, entity is selected, and feature is activated', async () => {
      userStoreMock.isCollab = false
      selectedEntityStoreMock.selectedEntityId = 123
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
      selectedEntityStoreMock.selectedEntityId = 123
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(true)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should set empty array when no entity is selected', async () => {
      userStoreMock.isCollab = false
      selectedEntityStoreMock.selectedEntityId = undefined
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(true)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should set empty array when booking feature is not activated', async () => {
      userStoreMock.isCollab = false
      selectedEntityStoreMock.selectedEntityId = 123
      vi.mocked(FeatureFlagManager.isFeatureActivated).mockReturnValue(false)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
      expect(FeatureFlagManager.isFeatureActivated).toHaveBeenCalledWith(Feature.BOOKING)
    })

    it('should handle errors and set empty array when service fails', async () => {
      const mockError = new Error('API error')
      userStoreMock.isCollab = false
      selectedEntityStoreMock.selectedEntityId = 123
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
