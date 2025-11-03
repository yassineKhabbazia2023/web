import { BookingService } from '@pulse/common/services/booking'
import { useUserStore, useSelectedEntityStore, useBookingStore } from '@pulse/common/stores'


import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature } from '@pulse/common/enums'

export class BookingManager {
  private static async loadAvailableExperts() {
    const selectedEntityStore = useSelectedEntityStore()
    const userStore = useUserStore()

    if (
      userStore.isCollab === false &&
      selectedEntityStore.selectedEntityId !== undefined &&
      FeatureFlagManager.isFeatureActivated(Feature.BOOKING) === true
    ) {
      try {
        return await BookingService.getBookingAvailableExperts({
          accountId: selectedEntityStore.selectedEntityId,
        })
      } catch (error) {
        logger.error(error)
      }
    }
    return []
  }

  static async refreshAvailableExperts() {
    const bookingStore = useBookingStore()

    const availableExperts = await BookingManager.loadAvailableExperts()

    bookingStore.setAvailableExperts(availableExperts)
  }
}
