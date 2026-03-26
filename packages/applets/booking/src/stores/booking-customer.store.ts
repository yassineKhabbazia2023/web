import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BookingServiceExpert } from '../types/booking.types'

export const useBookingCustomerStore = defineStore('booking-customer', () => {
  const availableExperts = ref<BookingServiceExpert[]>([])
  const isBookingEnabled = ref(false)

  function setAvailableExperts(experts: BookingServiceExpert[]) {
    availableExperts.value = experts
  }

  function getAvailableExperts() {
    return availableExperts.value
  }

  function getIsBookingEnabled() {
    return isBookingEnabled.value
  }

  function setIsBookingEnabled(value: boolean) {
    isBookingEnabled.value = value
  }

  function reset() {
    availableExperts.value = []
    isBookingEnabled.value = false
  }

  return {
    getAvailableExperts,
    getIsBookingEnabled,
    setAvailableExperts,
    setIsBookingEnabled,
    reset,
  }
})
