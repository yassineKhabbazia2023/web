import type { Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useBookingCustomerStore } from '@booking/stores'
import { BookingManager } from '@booking/shared/managers/booking.manager'
import { BookingAppointmentDrawerTabs } from './booking-appointment-drawer.enum'

export function useBookingAppointmentDrawer(isOpened: Ref<boolean>) {
  const { t } = useI18n({ useScope: 'global' })
  const bookingStore = useBookingCustomerStore()

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

  const expertIframeUrl = computed(() => {
    return availableExperts.value.find(expert => expert.contactId === selectedExpertId.value)?.iframeUrl || ''
  })

  // Drawer lifecycle
  function resetDrawer() {
    currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_EXPERT
    selectedExpertId.value = undefined
  }

  watch(isOpened, async (opened) => {
    if (opened === true) {
      resetDrawer()
      await loadExperts()
    }
  })

  return {
    availableExperts,
    selectedExpertId,
    steps,
    currentStep,
    isLoadingExperts,
    expertIframeUrl,
    closeDrawer,
    onSelectExpert,
  }
}

