import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBookingCollabStore = defineStore('booking-collab', () => {
  const hasBookingDrawerBeenOpened = ref(false)
  const isBookingDrawerOpened = ref(false)

  function openBookingDrawer() {
    hasBookingDrawerBeenOpened.value = true
    isBookingDrawerOpened.value = true
  }

  function closeBookingDrawer() {
    isBookingDrawerOpened.value = false
  }

  function reset() {
    hasBookingDrawerBeenOpened.value = false
    isBookingDrawerOpened.value = false
  }

  return {
    hasBookingDrawerBeenOpened,
    isBookingDrawerOpened,
    openBookingDrawer,
    closeBookingDrawer,
    reset,
  }
})
