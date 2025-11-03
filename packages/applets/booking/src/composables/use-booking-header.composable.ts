import { ref, computed } from 'vue'
import { useBookingStore } from '@pulse/common/stores'
import { AmplitudeService } from '@pulse/common/services/amplitude'

export function useBookingHeader() {
  const hasBookingDrawerBeenOpened = ref(false)
  const isBookingDrawerOpened = ref(false)

  function openDrawer() {
    AmplitudeService.track('Booking Configuration View Started')
    hasBookingDrawerBeenOpened.value = true
    isBookingDrawerOpened.value = true
  }

  const bookingStore = useBookingStore()
  const isOpenedBookingRendezVousDrawer = computed({
    get: () => bookingStore.isOpenedBookingRendezVousDrawer,
    set: (isOpened: boolean) => bookingStore.isOpenedBookingRendezVousDrawer = isOpened,
  })

  return {
    hasBookingDrawerBeenOpened,
    isBookingDrawerOpened,
    isOpenedBookingRendezVousDrawer,
    openDrawer,
  }
}
