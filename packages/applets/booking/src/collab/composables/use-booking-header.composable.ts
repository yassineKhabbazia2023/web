import { computed } from 'vue'
import { useBookingCollabStore } from '@pulse/common/stores'
import { BookingTrackingManager } from '@pulse/booking/shared/managers/booking-tracking'
import { useBookingCustomerStore } from '../../stores'

export function useBookingHeader() {
  const collabStore = useBookingCollabStore()
  const customerStore = useBookingCustomerStore()

  function openDrawer() {
    BookingTrackingManager.trackBookingConfigurationViewStarted()
    collabStore.openBookingDrawer()
  }

  const isOpenedBookingAppointmentDrawer = computed({
    get: () => customerStore.isAppointmentDrawerOpen,
    set: (isOpened: boolean) => customerStore.isAppointmentDrawerOpen = isOpened,
  })

  const hasBookingDrawerBeenOpened = computed(() => collabStore.hasBookingDrawerBeenOpened)
  const isBookingDrawerOpened = computed(() => collabStore.isBookingDrawerOpened)

  return {
    hasBookingDrawerBeenOpened,
    isBookingDrawerOpened,
    isOpenedBookingAppointmentDrawer,
    openDrawer,
  }
}
