import { computed } from 'vue'
import { useUserStore } from '@pulse/common/stores'
import { REDIRECT_PATH } from '@pulse/common/constants'
import { BookingRedirectAction } from '@booking/enums/booking-redirect-action.enums'
import { BOOKING_QUERY_PARAM_COLLABORATOR_ID } from '@booking/constants/booking.const'

/**
 * Composable to build booking widget URL for sharing
 * Generates redirect URL with collaborator ID for customer booking flow
 */
export function useBookingUrl() {
  const userStore = useUserStore()

  const bookingUrl = computed(() => {
    const userId = userStore.user?.id
    if (userId === undefined) {
      return ''
    }
    const params = new URLSearchParams()
    params.set('action', BookingRedirectAction.OPEN_BOOKING_WIDGET)
    params.set(BOOKING_QUERY_PARAM_COLLABORATOR_ID, String(userId))
    return `${globalThis.window.location.origin}${REDIRECT_PATH}?${params.toString()}`
  })

  return {
    bookingUrl,
  }
}
