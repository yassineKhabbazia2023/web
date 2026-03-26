import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { logger } from '@pulse/toolbox'
import type { AppointmentResponse } from '../types/booking.types'
import { BookingService } from '../services/booking.service'
import { DEFAULT_UPCOMING_LIMIT, DEFAULT_PAST_LIMIT } from '@booking/constants'

export const useBookingAppointmentsStore = defineStore('booking-appointments', () => {
  const upcomingAppointments = ref<AppointmentResponse[]>([])
  const pastAppointments = ref<AppointmentResponse[]>([])
  const upcomingAppointmentsCount = ref(0)
  const isLoadingUpcomingAppointments = ref(false)
  const isLoadingPastAppointments = ref(false)
  const isBookingAppointmentDrawerOpen = ref(false)
  const isBookingAppointmentsListDrawerOpen = ref(false)

  async function fetchUpcomingAppointments(limit = DEFAULT_UPCOMING_LIMIT) {
    isLoadingUpcomingAppointments.value = true
    try {
      upcomingAppointments.value = await BookingService.getUpcomingAppointments(limit)
    } catch (error) {
      logger.error(error)
      upcomingAppointments.value = []
    } finally {
      isLoadingUpcomingAppointments.value = false
    }
  }

  async function fetchPastAppointments(limit = DEFAULT_PAST_LIMIT) {
    isLoadingPastAppointments.value = true
    try {
      pastAppointments.value = await BookingService.getPastAppointments(limit)
    } catch (error) {
      logger.error(error)
      pastAppointments.value = []
    } finally {
      isLoadingPastAppointments.value = false
    }
  }

  async function fetchUpcomingAppointmentsCount() {
    try {
      upcomingAppointmentsCount.value = await BookingService.getUpcomingAppointmentsCount()
    } catch (error) {
      logger.error(error)
      upcomingAppointmentsCount.value = 0
    }
  }

  const hasUpcomingAppointments = computed(() => upcomingAppointmentsCount.value > 0)

  function openBookingAppointmentsListDrawer() {
    isBookingAppointmentsListDrawerOpen.value = true
  }

  function closeBookingAppointmentsListDrawer() {
    isBookingAppointmentsListDrawerOpen.value = false
  }

  function openBookingAppointmentDrawer() {
    isBookingAppointmentDrawerOpen.value = true
  }

  function closeBookingAppointmentDrawer() {
    isBookingAppointmentDrawerOpen.value = false
  }

  function reset() {
    upcomingAppointments.value = []
    pastAppointments.value = []
    upcomingAppointmentsCount.value = 0
    isLoadingUpcomingAppointments.value = false
    isLoadingPastAppointments.value = false
    isBookingAppointmentDrawerOpen.value = false
    isBookingAppointmentsListDrawerOpen.value = false
  }

  return {
    upcomingAppointments,
    pastAppointments,
    upcomingAppointmentsCount,
    isLoadingUpcomingAppointments,
    isLoadingPastAppointments,
    isBookingAppointmentDrawerOpen,
    isBookingAppointmentsListDrawerOpen,
    fetchUpcomingAppointments,
    fetchPastAppointments,
    fetchUpcomingAppointmentsCount,
    hasUpcomingAppointments,
    openBookingAppointmentDrawer,
    closeBookingAppointmentDrawer,
    openBookingAppointmentsListDrawer,
    closeBookingAppointmentsListDrawer,
    reset,
  }
})

