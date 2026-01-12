import { BookingService } from '../../services'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature } from '@pulse/common/enums'
import { useBookingCustomerStore } from '../../stores'

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
