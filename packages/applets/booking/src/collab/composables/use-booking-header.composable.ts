import { computed } from 'vue'
import { useBookingCollabStore, useBookingCustomerStore } from '@pulse/common/stores'
import { BookingTrackingManager } from '@pulse/booking/shared/managers/booking-tracking'

export function useBookingHeader() {
  const collabStore = useBookingCollabStore()
  const customerStore = useBookingCustomerStore()

  function openDrawer() {
    BookingTrackingManager.trackBookingConfigurationViewStarted()
    collabStore.openConfigDrawer()
  }

  const isOpenedBookingAppointmentDrawer = computed({
    get: () => customerStore.isAppointmentDrawerOpen,
    set: (isOpened: boolean) => customerStore.isAppointmentDrawerOpen = isOpened,
  })

  const hasBookingDrawerBeenOpened = computed(() => collabStore.hasConfigDrawerBeenOpened)
  const isBookingDrawerOpened = computed(() => collabStore.isConfigDrawerOpen)

  return {
    hasBookingDrawerBeenOpened,
    isBookingDrawerOpened,
    isOpenedBookingAppointmentDrawer,
    openDrawer,
  }
}
