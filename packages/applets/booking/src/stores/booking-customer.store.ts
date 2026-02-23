import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BookingServiceExpert } from '../types/booking.types'

export const useBookingCustomerStore = defineStore('booking-customer', () => {
  const availableExperts = ref<BookingServiceExpert[]>([])
  const isAppointmentDrawerOpen = ref(false)
  const isBookingEnabled = ref(false)

  function setAvailableExperts(experts: BookingServiceExpert[]) {
    availableExperts.value = experts
  }

  function getAvailableExperts() {
    return availableExperts.value
  }

  function hasAvailableExperts() {
    return availableExperts.value.length > 0
  }

  function getIsBookingEnabled() {
    return isBookingEnabled.value
  }

  function setIsBookingEnabled(value: boolean) {
    isBookingEnabled.value = value
  }

  function reset() {
    setAvailableExperts([])
    isAppointmentDrawerOpen.value = false
    setIsBookingEnabled(false)
  }

  function openAppointmentDrawer() {
    isAppointmentDrawerOpen.value = true
  }

  function closeAppointmentDrawer() {
    isAppointmentDrawerOpen.value = false
  }

  return {
    isAppointmentDrawerOpen,
    getAvailableExperts,
    getIsBookingEnabled,
    setAvailableExperts,
    setIsBookingEnabled,
    hasAvailableExperts,
    reset,
    openAppointmentDrawer,
    closeAppointmentDrawer,
  }
})
