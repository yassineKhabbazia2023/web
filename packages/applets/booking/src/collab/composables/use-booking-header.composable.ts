import { computed } from 'vue'
import { useBookingCollabStore } from '@pulse/common/stores'
import { useBookingCustomerStore } from '@booking/stores'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'

export function useBookingHeader() {
  const collabStore = useBookingCollabStore()
  const customerStore = useBookingCustomerStore()

  function openDrawer() {
    collabStore.openBookingDrawer()
    BookingTrackingService.trackCollaboratorWidgetOpened()
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
