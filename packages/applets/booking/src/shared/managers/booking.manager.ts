import { BookingService } from '@pulse/common/services/booking'
import { useUserStore, useCurrentEntityStore, useBookingCustomerStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature } from '@pulse/common/enums'

export class BookingManager {
  private static async loadAvailableExperts() {
    const currentEntityStore = useCurrentEntityStore()
    const userStore = useUserStore()

    if (
      userStore.isCollab === false &&
      currentEntityStore.currentEntityId !== undefined &&
      FeatureFlagManager.isFeatureActivated(Feature.BOOKING) === true
    ) {
      try {
        return await BookingService.getBookingAvailableExperts({
          accountId: currentEntityStore.currentEntityId,
        })
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
