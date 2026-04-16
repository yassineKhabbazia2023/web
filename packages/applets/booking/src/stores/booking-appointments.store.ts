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
  const preselectedCollaboratorId = ref<number | undefined>(undefined)

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

  function isValidCollaboratorId(collaboratorId?: number): boolean {
    if (collaboratorId === undefined) {
      return false
    }
    return Number.isFinite(collaboratorId) === true && collaboratorId > 0
  }

  function openBookingAppointmentDrawer(collaboratorId?: number) {
    if (isValidCollaboratorId(collaboratorId)) {
      preselectedCollaboratorId.value = collaboratorId
    } else if (collaboratorId !== undefined) {
      logger.warn('Invalid collaboratorId provided to openBookingAppointmentDrawer', { collaboratorId })
    }

    isBookingAppointmentDrawerOpen.value = true
  }

  function clearPreselectedCollaboratorId() {
    preselectedCollaboratorId.value = undefined
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
    preselectedCollaboratorId.value = undefined
  }

  return {
    upcomingAppointments,
    pastAppointments,
    upcomingAppointmentsCount,
    isLoadingUpcomingAppointments,
    isLoadingPastAppointments,
    isBookingAppointmentDrawerOpen,
    isBookingAppointmentsListDrawerOpen,
    preselectedCollaboratorId,
    fetchUpcomingAppointments,
    fetchPastAppointments,
    fetchUpcomingAppointmentsCount,
    hasUpcomingAppointments,
    openBookingAppointmentDrawer,
    clearPreselectedCollaboratorId,
    closeBookingAppointmentDrawer,
    openBookingAppointmentsListDrawer,
    closeBookingAppointmentsListDrawer,
    reset,
  }
})

