import { ref } from 'vue'
import { defineStore } from 'pinia'
import { BookingBusinessStatusResponse } from '@pulse/booking/types'

export const useBookingCollabStore = defineStore('booking-collab', () => {
  const hasBookingCreationDrawerBeenOpened = ref(false)
  const isBookingCreationDrawerOpened = ref(false)
  const isBookingEnabled = ref(false)
  const isBookingEditDrawerOpened = ref(false)
  const editConfigurationId = ref<number | null>(null)
  const bookingBusinessStatus = ref<BookingBusinessStatusResponse | null>(null)

  function openBookingCreationDrawer() {
    hasBookingCreationDrawerBeenOpened.value = true
    isBookingCreationDrawerOpened.value = true
  }

  function closeBookingCreationDrawer() {
    isBookingCreationDrawerOpened.value = false
  }

  function openBookingEditDrawer(configurationId: number) {
    editConfigurationId.value = configurationId
    isBookingEditDrawerOpened.value = true
  }

  function closeBookingEditDrawer() {
    isBookingEditDrawerOpened.value = false
    editConfigurationId.value = null
  }

  function setIsBookingEnabled(value: boolean) {
    isBookingEnabled.value = value
  }

  function setBookingBusinessStatus(status: BookingBusinessStatusResponse | null) {
    bookingBusinessStatus.value = status
  }

  function reset() {
    hasBookingCreationDrawerBeenOpened.value = false
    isBookingCreationDrawerOpened.value = false
    isBookingEnabled.value = false
    isBookingEditDrawerOpened.value = false
    editConfigurationId.value = null
    bookingBusinessStatus.value = null
  }

  return {
    // State
    hasBookingCreationDrawerBeenOpened,
    isBookingCreationDrawerOpened,
    isBookingEditDrawerOpened,
    editConfigurationId,
    bookingBusinessStatus,
    isBookingEnabled,
    // Actions
    openBookingCreationDrawer,
    closeBookingCreationDrawer,
    openBookingEditDrawer,
    closeBookingEditDrawer,
    setIsBookingEnabled,
    setBookingBusinessStatus,
    reset,
  }
})
