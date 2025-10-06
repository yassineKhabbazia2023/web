import { BookingService } from '../../services/booking/booking.service'
import { useUserStore } from '../../stores/user/user.store'
import { useSelectedEntityStore } from '../../stores/selected-entity/selected-entity.store'
import { useBookingStore } from '../../stores/booking/booking.store'
import { FeatureFlagManager, logger } from '@pulse/core'
import { Feature } from '@pulse/core/enums'

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
