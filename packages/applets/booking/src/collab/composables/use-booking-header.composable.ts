import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookingCollabStore } from '@pulse/common/stores'
import { useBookingAppointmentsStore } from '@booking/stores'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import { BookingSourceEvent } from '@booking/services/booking-tracking.enum'

export function useBookingHeader() {
  const collabStore = useBookingCollabStore()
  const appointmentsStore = useBookingAppointmentsStore()

  const { isBookingAppointmentDrawerOpen } = storeToRefs(appointmentsStore)

  function openDrawer() {
    collabStore.openBookingDrawer()
    BookingTrackingService.trackConfigurationOpened(BookingSourceEvent.HEADER)
  }

  const hasBookingDrawerBeenOpened = computed(() => collabStore.hasBookingDrawerBeenOpened)
  const isBookingDrawerOpened = computed(() => collabStore.isBookingDrawerOpened)

  return {
    hasBookingDrawerBeenOpened,
    isBookingDrawerOpened,
    isBookingAppointmentDrawerOpen,
    openDrawer,
  }
}
