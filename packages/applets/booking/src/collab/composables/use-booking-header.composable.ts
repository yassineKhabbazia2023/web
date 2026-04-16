import { computed } from 'vue'
import { useBookingCollabStore } from '@pulse/common/stores'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import { BookingSourceEvent } from '@booking/services/booking-tracking.enum'

export function useBookingHeader() {
  const collabStore = useBookingCollabStore()

  function openDrawer() {
    collabStore.openBookingCreationDrawer()
    BookingTrackingService.trackConfigurationOpened(BookingSourceEvent.HEADER)
  }

  const hasBookingCreationDrawerBeenOpened = computed(() => collabStore.hasBookingCreationDrawerBeenOpened)
  const isBookingCreationDrawerOpened = computed(() => collabStore.isBookingCreationDrawerOpened)

  return {
    hasBookingCreationDrawerBeenOpened,
    isBookingCreationDrawerOpened,
    openDrawer,
  }
}
