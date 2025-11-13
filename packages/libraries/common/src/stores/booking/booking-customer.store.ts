import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { BookingServiceExpert } from '@pulse/common/types'

export const useBookingCustomerStore = defineStore('booking-customer', () => {
  const availableExperts = ref<BookingServiceExpert[]>([])
  const isAppointmentDrawerOpen = ref(false)

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
    isAppointmentDrawerOpen.value = false
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
    setAvailableExperts,
    hasAvailableExperts,
    reset,
    openAppointmentDrawer,
    closeAppointmentDrawer,
  }
})
