import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBookingCollabStore = defineStore('booking-collab', () => {
  const hasBookingDrawerBeenOpened = ref(false)
  const isBookingDrawerOpened = ref(false)
  const isBookingEnabled = ref(false)

  function openBookingDrawer() {
    hasBookingDrawerBeenOpened.value = true
    isBookingDrawerOpened.value = true
  }

  function closeBookingDrawer() {
    isBookingDrawerOpened.value = false
  }

  function getIsBookingEnabled() {
    return isBookingEnabled.value
  }

  function setIsBookingEnabled(value: boolean) {
    isBookingEnabled.value = value
  }

  function reset() {
    hasBookingDrawerBeenOpened.value = false
    isBookingDrawerOpened.value = false
    isBookingEnabled.value = false
  }

  return {
    hasBookingDrawerBeenOpened,
    isBookingDrawerOpened,
    openBookingDrawer,
    closeBookingDrawer,
    getIsBookingEnabled,
    setIsBookingEnabled,
    reset,
  }
})
