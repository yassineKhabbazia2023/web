import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { useBookingCollabStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { BookingService } from '@booking/services'
import { BookingConfigurationSteps } from './booking-configuration.enums'
import {
  BOOKING_CONFIGURATION_STEP_TITLE_KEYS,
  BOOKING_CONFIGURATION_SUBMIT_SUCCESS_NOTIFICATION_KEY,
  BOOKING_CONFIRMATION_SUCCESS_TITLE_KEY,
  BOOKING_CONFIGURATION_SUBMIT_ERROR_NOTIFICATION_KEY,
} from './booking-configuration.consts'
import { BookingConfigurationManager } from './booking-configuration.manager'
import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'
import type { TimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'
import { getInitialTimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.composable'
import { useBookingDrawer } from '../booking-drawer/booking-drawer.composable'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'

export function useBookingConfiguration() {
  const { t } = useI18n({ useScope: 'global' })
  const collabStore = useBookingCollabStore()
  const currentStep = ref<BookingConfigurationSteps>(BookingConfigurationSteps.INTRO)
  const bookingDrawer = useBookingDrawer()

  const steps = [
    BookingConfigurationSteps.INTRO,
    BookingConfigurationSteps.CUSTOMIZE_MEETING,
    BookingConfigurationSteps.CONFIGURE_SLOTS,
    BookingConfigurationSteps.CONFIRMATION,
  ]

  // Map enum to step index for PSteps component
  const currentStepIndex = computed(() => {
    const stepMap = {
      [BookingConfigurationSteps.INTRO]: 0,
      [BookingConfigurationSteps.CUSTOMIZE_MEETING]: 1,
      [BookingConfigurationSteps.CONFIGURE_SLOTS]: 2,
      [BookingConfigurationSteps.CONFIRMATION]: 3,
    }
    return stepMap[currentStep.value]
  })

  const isConfirmationStep = computed(() => currentStep.value === BookingConfigurationSteps.CONFIRMATION)
  const isSubmitting = ref(false)
  const isSubmitSuccess = ref(false)

  async function goToNextStep() {
    const nextStepIndex = currentStepIndex.value + 1

    // When moving from CONFIGURE_SLOTS to CONFIRMATION, submit the configuration
    if (currentStep.value === BookingConfigurationSteps.CONFIGURE_SLOTS) {
      currentStep.value = steps[nextStepIndex]
      await submitConfiguration()
      return
    }

    // Cannot go further than CONFIRMATION
    if (isConfirmationStep.value === true) {
      return
    }

    currentStep.value = steps[nextStepIndex]
  }

  function goToPreviousStep() {
    // Cannot go back from CONFIRMATION step
    if (isConfirmationStep.value === true) {
      return
    }

    if (currentStepIndex.value === 0) {
      return
    }
    currentStep.value = steps[currentStepIndex.value - 1]
  }

  async function submitConfiguration() {
    isSubmitting.value = true
    isSubmitSuccess.value = false

    try {
      const payload = BookingConfigurationManager.prepareMeetingTemplatePayload(
        appointmentDetails.value,
        timeSlotsConfiguration.value,
      )

      // Extract unique enabled days from time slots
      const enabledDays = [...new Set(
        timeSlotsConfiguration.value.timeSlots.map(slot => slot.day),
      )]

      await BookingService.submitBookingConfiguration(payload)
      isSubmitSuccess.value = true
      displayNotification('success', t(BOOKING_CONFIGURATION_SUBMIT_SUCCESS_NOTIFICATION_KEY))
      BookingTrackingService.trackCollaboratorConfigurationSubmitted(true, enabledDays)
      BookingTrackingService.trackLinkSignatureConsulted()

      try {
        const bookingStatus = await BookingService.getBookingBusinessStatus()
        collabStore.setBookingBusinessStatus(bookingStatus)
      } catch (error) {
        logger.error('Failed to refresh booking business status', error)
        collabStore.setBookingBusinessStatus(null)
      }
    } catch (error) {
      logger.error('Failed to submit booking configuration', error)
      displayNotification('error', t(BOOKING_CONFIGURATION_SUBMIT_ERROR_NOTIFICATION_KEY))
      BookingTrackingService.trackCollaboratorConfigurationSubmitted(false)

      // Go back to previous step on error
      currentStep.value = BookingConfigurationSteps.CONFIGURE_SLOTS
      isSubmitSuccess.value = false
    } finally {
      isSubmitting.value = false
    }
  }

  function closeDrawer() {
    bookingDrawer.closeBookingCreationDrawer()
  }

  const appointmentDetails = ref<AppointmentDetails>({
    name: '',
    description: '',
    location: '',
    isOnline: false,
    duration: 30,
  })

  const timeSlotsConfiguration = ref<TimeSlotsConfiguration>(getInitialTimeSlotsConfiguration())

  // Drawer title changes based on step and submission status
  const drawerTitle = computed(() => {
    if (currentStep.value === BookingConfigurationSteps.CONFIRMATION && isSubmitSuccess.value === true) {
      return t(BOOKING_CONFIRMATION_SUCCESS_TITLE_KEY)
    }
    return t(BOOKING_CONFIGURATION_STEP_TITLE_KEYS[currentStep.value])
  })

  return {
    // State
    currentStep,
    currentStepIndex,
    appointmentDetails,
    timeSlotsConfiguration,
    drawerTitle,
    isSubmitting,
    isSubmitSuccess,
    isConfirmationStep,
    // Methods
    goToNextStep,
    goToPreviousStep,
    submitConfiguration,
    closeDrawer,
  }
}
