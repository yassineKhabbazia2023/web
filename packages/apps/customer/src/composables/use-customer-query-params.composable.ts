import { useBookingQueryParams } from '@pulse/booking/customer/composables'

/**
 * Global composable for handling customer app query parameters
 *
 * Orchestrates all query param watchers for the customer experience
 * Currently manages:
 * - Booking widget query params (bookingWidget, collaboratorId)
 *
 * This composable uses Vue's reactive watchers to automatically handle
 * query params when features become available
 *
 * @example
 * // In customer-home.experience.vue
 * useCustomerQueryParams()
 *
 * // Watchers will automatically react when booking becomes enabled
 */
export function useCustomerQueryParams() {
  // Setup watchers for booking-related query params
  // Everything is handled automatically via reactive watchers
  useBookingQueryParams()
}
