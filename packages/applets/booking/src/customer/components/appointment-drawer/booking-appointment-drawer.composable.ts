import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookingCustomerStore, useBookingAppointmentsStore } from '@booking/stores'
import { BookingManager } from '@booking/shared/managers/booking.manager'
import { BookingAppointmentDrawerTabs } from './booking-appointment-drawer.enum'

export function useBookingAppointmentDrawer(isOpened: Ref<boolean>) {
  const { t } = useI18n({ useScope: 'global' })
  const bookingStore = useBookingCustomerStore()
  const appointmentsStore = useBookingAppointmentsStore()

  // Drawer open/close
  function closeDrawer() {
    isOpened.value = false
  }

  // Steps navigation
  const currentStep = ref<BookingAppointmentDrawerTabs>(BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
  const steps = computed(() => [
    { label: t('booking-appointment-drawer.steps.choose-expert') },
    { label: t('booking-appointment-drawer.steps.choose-time-slot') },
  ])
  const isExpertStep = computed(() => currentStep.value === BookingAppointmentDrawerTabs.CHOOSE_EXPERT)
  const isTimeSlotStep = computed(() => currentStep.value === BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT)

  // Expert selection
  const selectedExpertId = ref<number | undefined>()
  const availableExperts = computed(() => bookingStore.getAvailableExperts())
  const isLoadingExperts = ref(false)

  async function loadExperts() {
    isLoadingExperts.value = true
    try {
      await BookingManager.refreshAvailableExperts()
    } finally {
      isLoadingExperts.value = false
    }
  }

  function onSelectExpert(expertId: number) {
    selectedExpertId.value = expertId
    currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT
  }

  // Drawer lifecycle
  function resetDrawer() {
    currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_EXPERT
    selectedExpertId.value = undefined
  }

  /**
   * Handles preselected expert from URL params
   * Verifies the expert exists before auto-selecting
   * Always clears the preselected ID after attempting to use it
   */
  function handlePreselectedExpert() {
    const preselectedId = appointmentsStore.preselectedCollaboratorId

    if (preselectedId === undefined) {
      return
    }

    // Verify the expert exists in the available list before selecting
    const expertExists = availableExperts.value.some(expert => expert.id === preselectedId)

    if (expertExists === true) {
      onSelectExpert(preselectedId)
    }

    // Always clear the preselected ID after attempting to use it
    appointmentsStore.clearPreselectedCollaboratorId()
  }

  watch(isOpened, async (opened) => {
    if (opened === false) {
      return
    }

    resetDrawer()
    await loadExperts()

    // Check if drawer is still open after async operation (prevents race condition)
    if (isOpened.value === false) {
      return
    }

    handlePreselectedExpert()
  }, { immediate: true })

  return {
    availableExperts,
    selectedExpertId,
    steps,
    currentStep,
    isExpertStep,
    isTimeSlotStep,
    isLoadingExperts,
    closeDrawer,
    onSelectExpert,
  }
}

