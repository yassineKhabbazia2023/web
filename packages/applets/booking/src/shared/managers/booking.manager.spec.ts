import { loggerMock } from '@pulse/toolbox/mocks'
import { BookingManager } from './booking.manager'
import { BookingService } from '../../services'
import { useUserStore, useCurrentEntityStore, useBookingCollabStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useBookingCustomerStore } from '../../stores'
import { getMockExperts } from '../../__mocks__'

const mockExperts = getMockExperts()

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const bookingCustomerStoreMock = getStoreMock(useBookingCustomerStore)
const bookingCollabStoreMock = getStoreMock(useBookingCollabStore)

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

describe('BookingManager', () => {

  beforeEach(() => {
    userStoreMock.isCollab = false
    currentEntityStoreMock.currentEntityId = undefined
    bookingCustomerStoreMock.getIsBookingEnabled.mockReturnValue(false)

    vi.spyOn(BookingService, 'getBookingAvailableExperts')
    vi.spyOn(BookingService, 'getBookingEnabledFlag')
    vi.spyOn(BookingService, 'getBookingEligibility')
    vi.spyOn(logger, 'error')
  })

  describe('setupBookingForCollab', () => {
    it('should set collab booking enabled when API returns true', async () => {
      vi.mocked(BookingService.getBookingEnabledFlag).mockResolvedValue(true)

      await BookingManager.setupBookingForCollab()

      expect(BookingService.getBookingEnabledFlag).toHaveBeenCalled()
      expect(bookingCollabStoreMock.setIsBookingEnabled).toHaveBeenCalledWith(true)
      expect(bookingCustomerStoreMock.setIsBookingEnabled).not.toHaveBeenCalled()
    })

    it('should set collab booking enabled when API returns false', async () => {
      vi.mocked(BookingService.getBookingEnabledFlag).mockResolvedValue(false)

      await BookingManager.setupBookingForCollab()

      expect(bookingCollabStoreMock.setIsBookingEnabled).toHaveBeenCalledWith(false)
      expect(bookingCustomerStoreMock.setIsBookingEnabled).not.toHaveBeenCalled()
    })
  })

  describe('setupBookingForCustomer', () => {
    it('should set customer booking enabled to true when user is eligible and has access', async () => {
      vi.mocked(BookingService.getBookingEligibility).mockResolvedValue(true)
      vi.mocked(BookingService.getBookingEnabledFlag).mockResolvedValue(true)

      await BookingManager.setupBookingForCustomer()

      expect(BookingService.getBookingEligibility).toHaveBeenCalled()
      expect(BookingService.getBookingEnabledFlag).toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setIsBookingEnabled).toHaveBeenCalledWith(true)
      expect(bookingCollabStoreMock.setIsBookingEnabled).not.toHaveBeenCalled()
    })

    it('should set customer booking enabled to false when user is eligible but has no access', async () => {
      vi.mocked(BookingService.getBookingEligibility).mockResolvedValue(true)
      vi.mocked(BookingService.getBookingEnabledFlag).mockResolvedValue(false)

      await BookingManager.setupBookingForCustomer()

      expect(BookingService.getBookingEligibility).toHaveBeenCalled()
      expect(BookingService.getBookingEnabledFlag).toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setIsBookingEnabled).toHaveBeenCalledWith(false)
      expect(bookingCollabStoreMock.setIsBookingEnabled).not.toHaveBeenCalled()
    })

    it('should not check enabled flag nor update store when user is not eligible', async () => {
      vi.mocked(BookingService.getBookingEligibility).mockResolvedValue(false)

      await BookingManager.setupBookingForCustomer()

      expect(BookingService.getBookingEligibility).toHaveBeenCalled()
      expect(BookingService.getBookingEnabledFlag).not.toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setIsBookingEnabled).not.toHaveBeenCalled()
      expect(bookingCollabStoreMock.setIsBookingEnabled).not.toHaveBeenCalled()
    })
  })

  describe('refreshAvailableExperts', () => {
    it('should load and set available experts when user is client, entity is selected, and has booking access', async () => {
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = 123
      bookingCustomerStoreMock.getIsBookingEnabled.mockReturnValue(true)
      vi.mocked(BookingService.getBookingAvailableExperts).mockResolvedValue(mockExperts)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setAvailableExperts).toHaveBeenCalledWith(mockExperts)
    })

    it('should set empty array when user is collab', async () => {
      userStoreMock.isCollab = true
      currentEntityStoreMock.currentEntityId = 123
      bookingCustomerStoreMock.getIsBookingEnabled.mockReturnValue(true)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should set empty array when no entity is selected', async () => {
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = undefined
      bookingCustomerStoreMock.getIsBookingEnabled.mockReturnValue(true)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should set empty array when booking access is not granted', async () => {
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = 123
      bookingCustomerStoreMock.getIsBookingEnabled.mockReturnValue(false)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).not.toHaveBeenCalled()
      expect(bookingCustomerStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })

    it('should handle errors and set empty array when service fails', async () => {
      const mockError = new Error('API error')
      userStoreMock.isCollab = false
      currentEntityStoreMock.currentEntityId = 123
      bookingCustomerStoreMock.getIsBookingEnabled.mockReturnValue(true)
      vi.mocked(BookingService.getBookingAvailableExperts).mockRejectedValue(mockError)

      await BookingManager.refreshAvailableExperts()

      expect(BookingService.getBookingAvailableExperts).toHaveBeenCalled()
      expect(logger.error).toHaveBeenCalledWith(mockError)
      expect(bookingCustomerStoreMock.setAvailableExperts).toHaveBeenCalledWith([])
    })
  })
})
