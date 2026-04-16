import { watch, nextTick, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useBookingAppointmentsStore, useBookingCustomerStore } from '@booking/stores'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@booking/constants'
import { extractIntegerQueryParam, extractSingleQueryParam } from '@pulse/toolbox/utils/url'

/**
 * Composable for handling booking-related URL query parameters
 *
 * Automatically opens the booking drawer when bookingWidget=true is present in URL
 * Optionally preselects a collaborator if a valid collaboratorId is provided
 *
 * Query parameters are automatically cleared from URL when drawer closes
 *
 * This composable uses Vue watchers to automatically handle query params
 * when booking becomes enabled (reactive)
 *
 * @example
 * // In a Vue component
 * useBookingQueryParams()
 *
 * // URL: ?bookingWidget=true
 * // → Opens booking drawer automatically when booking is enabled
 *
 * // URL: ?bookingWidget=true&collaboratorId=123
 * // → Opens booking drawer with collaborator 123 preselected
 */
export function useBookingQueryParams() {
  const route = useRoute()
  const router = useRouter()
  const appointmentsStore = useBookingAppointmentsStore()
  const customerStore = useBookingCustomerStore()

  // Extract reactive refs from stores
  const { isBookingEnabled } = storeToRefs(customerStore)
  const { isBookingAppointmentDrawerOpen } = storeToRefs(appointmentsStore)

  /**
   * Checks if booking query parameters are present in URL
   * Uses strict validation (bookingWidget must be exactly 'true')
   * Handles arrays by extracting the first value
   */
  function hasBookingQueryParams(): boolean {
    return extractSingleQueryParam(route.query[BOOKING_QUERY_PARAM_WIDGET]) === 'true'
  }

  /**
   * Removes booking-related query parameters from URL
   * Preserves other query parameters
   */
  function clearBookingQueryParams() {
    if (hasBookingQueryParams() === false) {
      return
    }

    const cleanQuery = { ...route.query }
    delete cleanQuery[BOOKING_QUERY_PARAM_WIDGET]
    delete cleanQuery[BOOKING_QUERY_PARAM_COLLABORATOR_ID]
    router.replace({ query: cleanQuery })
  }

  /**
   * Handles booking query parameters
   * Opens drawer if conditions are met:
   * - Valid booking query params present
   * - Drawer is not already open
   */
  function handleBookingQueryParams() {
    if (hasBookingQueryParams() === false) {
      return
    }

    if (isBookingAppointmentDrawerOpen.value === true) {
      return
    }

    const collaboratorId = extractIntegerQueryParam(route.query[BOOKING_QUERY_PARAM_COLLABORATOR_ID])

    // Open the drawer with optional collaborator preselection
    appointmentsStore.openBookingAppointmentDrawer(collaboratorId)
  }

  // Clear query params when drawer closes
  watch(isBookingAppointmentDrawerOpen, (isOpen) => {
    if (isOpen === false) {
      clearBookingQueryParams()
    }
  })

  const stopWatcher = watch(
    isBookingEnabled,
    async (enabled) => {
      if (enabled === true) {
        await nextTick()
        handleBookingQueryParams()
      }
    },
    { immediate: true },
  )

  onUnmounted(() => {
    stopWatcher()
  })
}
