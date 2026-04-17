import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBookingCollabStore, useUserStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { BookingService } from '@booking/services'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import type { BookingConfigurationDetails, BookingConfigurationUpdatePayload } from '@booking/types'
import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'
import type { TimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'
import {
  BOOKING_QUERY_PARAM_WIDGET,
  BOOKING_QUERY_PARAM_COLLABORATOR_ID,
} from '@booking/constants/booking.const'
import type { UseBookingEditDrawerOptions } from './booking-edit-drawer.types'
import { BookingEditDrawerTab } from './booking-edit-drawer.enums'
import {
  mapApiToAppointmentDetails,
  mapApiToTimeSlotsConfiguration,
  mapToUpdatePayload,
} from './booking-edit-drawer.utils'

export function useBookingEditDrawer(options: UseBookingEditDrawerOptions) {
  const collabStore = useBookingCollabStore()
  const userStore = useUserStore()
  const { isBookingEditDrawerOpened, editConfigurationId } = storeToRefs(collabStore)
  const { closeBookingEditDrawer } = collabStore

  const activeTab = ref<BookingEditDrawerTab>(BookingEditDrawerTab.GENERAL)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isConfirmationModalOpen = ref(false)
  const configurationDetails = ref<BookingConfigurationDetails | null>(null)

  const appointmentDetails = ref<AppointmentDetails>({
    name: '',
    description: '',
    location: '',
    isOnline: true,
    duration: 30,
  })

  const timeSlotsConfiguration = ref<TimeSlotsConfiguration>({
    timeSlots: [],
  })

  const initialPayload = ref<BookingConfigurationUpdatePayload | null>(null)

  const builtBookingUrl = computed(() => {
    const userId = userStore.user?.id
    if (userId === undefined) {
      return ''
    }
    const params = new URLSearchParams()
    params.set(BOOKING_QUERY_PARAM_WIDGET, 'true')
    params.set(BOOKING_QUERY_PARAM_COLLABORATOR_ID, String(userId))
    return `${globalThis.window.location.origin}?${params.toString()}`
  })

  const currentPayload = computed(() => {
    return mapToUpdatePayload(appointmentDetails.value, timeSlotsConfiguration.value)
  })

  const hasUnsavedChanges = computed(() => {
    if (initialPayload.value === null) {
      return false
    }
    return JSON.stringify(currentPayload.value) !== JSON.stringify(initialPayload.value)
  })

  async function fetchConfigurationDetails() {
    if (editConfigurationId.value === null) {
      return
    }

    isLoading.value = true
    try {
      configurationDetails.value = await BookingService.getBookingConfigurationDetails(editConfigurationId.value)
      appointmentDetails.value = mapApiToAppointmentDetails(configurationDetails.value)
      timeSlotsConfiguration.value = mapApiToTimeSlotsConfiguration(configurationDetails.value)
      initialPayload.value = mapToUpdatePayload(appointmentDetails.value, timeSlotsConfiguration.value)
    } catch (error) {
      logger.error(error)
      configurationDetails.value = null
    } finally {
      isLoading.value = false
    }
  }

  function handleBeforeClose(done?: () => void) {
    if (hasUnsavedChanges.value === true) {
      isConfirmationModalOpen.value = true
      return
    }

    if (typeof done === 'function') {
      done()
    }

    forceClose()
  }

  function closeConfirmationModal() {
    isConfirmationModalOpen.value = false
  }

  function handleDiscardChanges() {
    closeConfirmationModal()
    forceClose()
  }

  async function saveConfiguration(): Promise<boolean> {
    if (editConfigurationId.value === null) {
      return false
    }

    isSaving.value = true
    try {
      await BookingService.updateBookingConfiguration(editConfigurationId.value, currentPayload.value)
      options.onSuccess()
      BookingTrackingService.trackSlotModificationValidated(true)
      return true
    } catch (error) {
      logger.error(error)
      options.onError()
      BookingTrackingService.trackSlotModificationValidated(false)
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function handleSave() {
    const isSuccess = await saveConfiguration()
    if (isSuccess === true) {
      forceClose()
    }
  }

  async function confirmSave() {
    const isSuccess = await saveConfiguration()
    closeConfirmationModal()
    if (isSuccess === true) {
      forceClose()
    }
  }

  function forceClose() {
    initialPayload.value = null
    closeBookingEditDrawer()
    activeTab.value = BookingEditDrawerTab.GENERAL
  }

  watch(isBookingEditDrawerOpened, (isOpened) => {
    if (isOpened === true) {
      fetchConfigurationDetails()
      BookingTrackingService.trackSlotModificationStarted()
    }
  })

  return {
    // State
    isBookingEditDrawerOpened,
    activeTab,
    isLoading,
    isSaving,
    isConfirmationModalOpen,
    configurationDetails,
    appointmentDetails,
    timeSlotsConfiguration,
    builtBookingUrl,
    hasUnsavedChanges,

    // Actions
    handleBeforeClose,
    handleDiscardChanges,
    handleSave,
    confirmSave,
    forceClose,
  }
}
