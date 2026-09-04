import { BookingService } from '../../services'
import { useUserStore, useCurrentEntityStore, useBookingCollabStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { useBookingCustomerStore } from '../../stores'

export class BookingManager {
  static async setupBookingForCollab() {
    const bookingCollabStore = useBookingCollabStore()
    const hasAccess = await BookingService.getBookingEnabledFlag()
    bookingCollabStore.setIsBookingEnabled(hasAccess)
  }

  static async setupBookingForCustomer() {
    const bookingCustomerStore = useBookingCustomerStore()
    const hasAccess = await BookingService.getBookingEnabledFlag()
    if (hasAccess) {
      const isEligibleForBooking = await BookingService.getBookingEligibility()
      bookingCustomerStore.setIsBookingEnabled(isEligibleForBooking)
    }
  }

  private static async loadAvailableExperts() {
    const currentEntityStore = useCurrentEntityStore()
    const userStore = useUserStore()
    const bookingCustomerStore = useBookingCustomerStore()

    if (
      userStore.isCollab === false &&
      currentEntityStore.currentEntityId !== undefined &&
      bookingCustomerStore.getIsBookingEnabled() === true
    ) {
      try {
        return await BookingService.getBookingAvailableExperts()
      } catch (error) {
        logger.error(error)
      }
    }
    return []
  }

  static async refreshAvailableExperts() {
    const bookingStore = useBookingCustomerStore()

    const availableExperts = await BookingManager.loadAvailableExperts()

    bookingStore.setAvailableExperts(availableExperts)
  }
}
