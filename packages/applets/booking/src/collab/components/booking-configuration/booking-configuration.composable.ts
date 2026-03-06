import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { BookingService } from '@booking/services'
import { BookingConfigurationSteps } from './booking-configuration.enums'
import { BOOKING_CONFIGURATION_STEP_TITLE_KEYS } from './booking-configuration.constants'
import { BookingConfigurationManager } from './booking-configuration.manager'
import type { AppointmentDetails } from '../booking-appointment-configuration/booking-appointment-configuration.types'
import type { TimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.types'
import { getInitialTimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.composable'
import { useBookingDrawer } from '../booking-drawer/booking-drawer.composable'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'

export function useBookingConfiguration() {
  const { t } = useI18n({ useScope: 'global' })
  const currentStep = ref<BookingConfigurationSteps>(BookingConfigurationSteps.INTRO)
  const bookingDrawer = useBookingDrawer()

  const steps = [
    BookingConfigurationSteps.INTRO,
    BookingConfigurationSteps.CUSTOMIZE_MEETING,
    BookingConfigurationSteps.CONFIGURE_SLOTS,
  ]

  // Map enum to step index for PSteps component
  const currentStepIndex = computed(() => {
    const stepMap = {
      [BookingConfigurationSteps.INTRO]: 0,
      [BookingConfigurationSteps.CUSTOMIZE_MEETING]: 1,
      [BookingConfigurationSteps.CONFIGURE_SLOTS]: 2,
    }
    return stepMap[currentStep.value]
  })

  const isLastStep = computed(() => currentStepIndex.value === steps.length - 1)
  const isSubmitting = ref(false)

  async function goToNextStep() {
    if (isLastStep.value) {
      await submitConfiguration()
      return
    }
    currentStep.value = steps[currentStepIndex.value + 1]
  }

  function goToPreviousStep() {
    if (currentStepIndex.value === 0) {
      return
    }
    currentStep.value = steps[currentStepIndex.value - 1]
  }

  async function submitConfiguration() {
    isSubmitting.value = true

    try {
      const payload = BookingConfigurationManager.prepareMeetingTemplatePayload(
        appointmentDetails.value,
        timeSlotsConfiguration.value,
      )

      const result = await BookingService.submitBookingConfiguration(payload)
      bookingDrawer.closeBookingDrawer()
      displayNotification('success', t('notifications.submit-success'))
      BookingTrackingService.trackCollaboratorConfigurationSubmitted(true)

      return result
    } catch (error) {
      logger.error('Failed to submit booking configuration', error)

      displayNotification('error', t('notifications.submit-error'))
      BookingTrackingService.trackCollaboratorConfigurationSubmitted(false)

      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  const appointmentDetails = ref<AppointmentDetails>({
    name: '',
    description: '',
    location: '',
    isOnline: false,
    duration: 30,
  })

  const timeSlotsConfiguration = ref<TimeSlotsConfiguration>(getInitialTimeSlotsConfiguration())

  const drawerTitle = computed(() => {
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
    // Methods
    goToNextStep,
    goToPreviousStep,
    submitConfiguration,
  }
}
