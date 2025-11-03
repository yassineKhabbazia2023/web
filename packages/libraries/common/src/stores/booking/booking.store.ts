import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BookingServiceExpert } from '@pulse/common/types'

export const useBookingStore = defineStore('booking', () => {
  const availableExperts = ref<BookingServiceExpert[]>([])
  const isOpenedBookingRendezVousDrawer = ref(false)

  function setAvailableExperts(experts: BookingServiceExpert[]) {
    availableExperts.value = experts
  }

  function getAvailableExperts() {
    return availableExperts.value
  }

  function hasAvailableExperts() {
    return availableExperts.value.length > 0
  }

  function reset() {
    setAvailableExperts([])
    isOpenedBookingRendezVousDrawer.value = false
  }

  return {
    isOpenedBookingRendezVousDrawer,
    getAvailableExperts,
    setAvailableExperts,
    hasAvailableExperts,
    reset,
  }
})
