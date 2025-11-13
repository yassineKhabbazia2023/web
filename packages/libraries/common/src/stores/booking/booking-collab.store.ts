import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBookingCollabStore = defineStore('booking-collab', () => {
  const hasConfigDrawerBeenOpened = ref(false)
  const isConfigDrawerOpen = ref(false)

  function openConfigDrawer() {
    hasConfigDrawerBeenOpened.value = true
    isConfigDrawerOpen.value = true
  }

  function closeConfigDrawer() {
    isConfigDrawerOpen.value = false
  }

  function reset() {
    hasConfigDrawerBeenOpened.value = false
    isConfigDrawerOpen.value = false
  }

  return {
    hasConfigDrawerBeenOpened,
    isConfigDrawerOpen,
    openConfigDrawer,
    closeConfigDrawer,
    reset,
  }
})
