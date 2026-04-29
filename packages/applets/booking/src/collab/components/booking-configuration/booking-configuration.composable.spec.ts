import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useBookingConfiguration } from './booking-configuration.composable'
import { BookingService } from '@booking/services'
import { BookingConfigurationManager } from './booking-configuration.manager'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import { BookingConfigurationSteps } from './booking-configuration.enums'
import {
  BOOKING_CONFIGURATION_SUBMIT_SUCCESS_NOTIFICATION_KEY,
  BOOKING_CONFIGURATION_SUBMIT_ERROR_NOTIFICATION_KEY,
} from './booking-configuration.consts'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { getInitialTimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.composable'
import type { BookingConfigurationResponse } from '@booking/types'
import {
  getMockedTimeSlotsConfiguration,
  getMockedBookingConfigurationPayload,
  getMockedBookingConfigurationResponse,
  getMockedAppointmentDetails,
} from '@booking/__mocks__/booking.mock'

const closeBookingCreationDrawerMock = vi.fn()
const isBookingCreationDrawerOpenedMock = ref(false)

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
  createI18n: vi.fn(),
}))

vi.mock('@pulse/styleguide')
vi.mock('@pulse/toolbox')
vi.mock('@booking/services')
vi.mock('./booking-configuration.manager')
vi.mock('../booking-time-slots-configuration/booking-time-slots-configuration.composable')
vi.mock('@booking/services/booking-tracking.service')
vi.mock('../booking-drawer/booking-drawer.composable', () => ({
  useBookingDrawer: () => ({
    closeBookingCreationDrawer: closeBookingCreationDrawerMock,
    isBookingCreationDrawerOpened: isBookingCreationDrawerOpenedMock,
  }),
}))

describe('useBookingConfiguration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(getInitialTimeSlotsConfiguration).mockReturnValue(getMockedTimeSlotsConfiguration())
    vi.mocked(BookingConfigurationManager.prepareMeetingTemplatePayload).mockReturnValue(getMockedBookingConfigurationPayload())
  })

  describe('initial state', () => {
    it('should start at INTRO step', () => {
      const { currentStep } = useBookingConfiguration()

      expect(currentStep.value).toBe(BookingConfigurationSteps.INTRO)
    })

    it('should have currentStepIndex of 0', () => {
      const { currentStepIndex } = useBookingConfiguration()

      expect(currentStepIndex.value).toBe(0)
    })

    it('should not be submitting initially', () => {
      const { isSubmitting } = useBookingConfiguration()

      expect(isSubmitting.value).toBe(false)
    })
  })

  describe('navigation', () => {
    it('should go to next step when goToNextStep is called', async () => {
      const { currentStep, goToNextStep } = useBookingConfiguration()

      await goToNextStep()

      expect(currentStep.value).toBe(BookingConfigurationSteps.CUSTOMIZE_MEETING)
    })

    it('should go to previous step when goToPreviousStep is called', async () => {
      const { currentStep, goToNextStep, goToPreviousStep } = useBookingConfiguration()

      await goToNextStep()
      goToPreviousStep()

      expect(currentStep.value).toBe(BookingConfigurationSteps.INTRO)
    })

    it('should not go before first step', () => {
      const { currentStep, goToPreviousStep } = useBookingConfiguration()

      goToPreviousStep()

      expect(currentStep.value).toBe(BookingConfigurationSteps.INTRO)
    })
  })

  describe('submitConfiguration', () => {
    it('should call BookingTrackingService.trackCollaboratorConfigurationSubmitted with true on success', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(vi.mocked(BookingTrackingService.trackCollaboratorConfigurationSubmitted)).toHaveBeenCalledWith(true, [])
    })

    it('should call BookingTrackingService.trackCollaboratorConfigurationSubmitted with false on failure', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(vi.mocked(BookingTrackingService.trackCollaboratorConfigurationSubmitted)).toHaveBeenCalledWith(false)
    })

    it('should set isSubmitSuccess to true on success', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { submitConfiguration, isSubmitSuccess } = useBookingConfiguration()

      await submitConfiguration()

      expect(isSubmitSuccess.value).toBe(true)
    })

    it('should display success notification on successful submission', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', BOOKING_CONFIGURATION_SUBMIT_SUCCESS_NOTIFICATION_KEY)
    })

    it('should display error notification on failed submission', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', BOOKING_CONFIGURATION_SUBMIT_ERROR_NOTIFICATION_KEY)
    })

    it('should log error on failed submission', async () => {
      const error = new Error('API Error')
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(error)

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Failed to submit booking configuration', error)
    })

    it('should go back to CONFIGURE_SLOTS step on error', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration, currentStep } = useBookingConfiguration()

      await submitConfiguration()

      expect(currentStep.value).toBe(BookingConfigurationSteps.CONFIGURE_SLOTS)
    })

    it('should prepare payload with appointment details and time slots configuration', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { submitConfiguration, appointmentDetails, timeSlotsConfiguration } = useBookingConfiguration()

      appointmentDetails.value = getMockedAppointmentDetails()

      await submitConfiguration()

      expect(vi.mocked(BookingConfigurationManager.prepareMeetingTemplatePayload)).toHaveBeenCalledWith(
        appointmentDetails.value,
        timeSlotsConfiguration.value,
      )
    })

    it('should set isSubmitting to true during submission', async () => {
      let resolvePromise: (value: BookingConfigurationResponse) => void
      const pendingPromise = new Promise<BookingConfigurationResponse>((resolve) => {
        resolvePromise = resolve
      })
      vi.mocked(BookingService.submitBookingConfiguration).mockReturnValueOnce(pendingPromise)

      const { submitConfiguration, isSubmitting } = useBookingConfiguration()

      const submissionPromise = submitConfiguration()

      expect(isSubmitting.value).toBe(true)

      resolvePromise!(getMockedBookingConfigurationResponse())
      await submissionPromise

      expect(isSubmitting.value).toBe(false)
    })

    it('should set isSubmitting to false after failed submission', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration, isSubmitting } = useBookingConfiguration()

      await submitConfiguration()

      expect(isSubmitting.value).toBe(false)
    })

    it('should set isSubmitSuccess to false on error', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration, isSubmitSuccess } = useBookingConfiguration()

      await submitConfiguration()

      expect(isSubmitSuccess.value).toBe(false)
    })
  })

  describe('goToNextStep with confirmation step', () => {
    it('should move to CONFIRMATION step and submit when on CONFIGURE_SLOTS', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { goToNextStep, currentStep } = useBookingConfiguration()

      await goToNextStep() // INTRO -> CUSTOMIZE_MEETING
      await goToNextStep() // CUSTOMIZE_MEETING -> CONFIGURE_SLOTS
      await goToNextStep() // CONFIGURE_SLOTS -> CONFIRMATION + submit

      expect(currentStep.value).toBe(BookingConfigurationSteps.CONFIRMATION)
      expect(vi.mocked(BookingService.submitBookingConfiguration)).toHaveBeenCalled()
      expect(vi.mocked(BookingTrackingService.trackCollaboratorConfigurationSubmitted)).toHaveBeenCalledWith(true, [])
    })

    it('should not go further than CONFIRMATION step', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { goToNextStep, currentStep } = useBookingConfiguration()

      await goToNextStep() // INTRO -> CUSTOMIZE_MEETING
      await goToNextStep() // CUSTOMIZE_MEETING -> CONFIGURE_SLOTS
      await goToNextStep() // CONFIGURE_SLOTS -> CONFIRMATION
      await goToNextStep() // Should stay at CONFIRMATION

      expect(currentStep.value).toBe(BookingConfigurationSteps.CONFIRMATION)
    })

    it('should not go back from CONFIRMATION step', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { goToNextStep, goToPreviousStep, currentStep } = useBookingConfiguration()

      await goToNextStep() // INTRO -> CUSTOMIZE_MEETING
      await goToNextStep() // CUSTOMIZE_MEETING -> CONFIGURE_SLOTS
      await goToNextStep() // CONFIGURE_SLOTS -> CONFIRMATION
      goToPreviousStep() // Should stay at CONFIRMATION

      expect(currentStep.value).toBe(BookingConfigurationSteps.CONFIRMATION)
    })
  })

  describe('isConfirmationStep', () => {
    it('should return false initially', () => {
      const { isConfirmationStep } = useBookingConfiguration()

      expect(isConfirmationStep.value).toBe(false)
    })

    it('should return true when on CONFIRMATION step', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { goToNextStep, isConfirmationStep } = useBookingConfiguration()

      await goToNextStep() // INTRO -> CUSTOMIZE_MEETING
      await goToNextStep() // CUSTOMIZE_MEETING -> CONFIGURE_SLOTS
      await goToNextStep() // CONFIGURE_SLOTS -> CONFIRMATION

      expect(isConfirmationStep.value).toBe(true)
    })
  })

  describe('closeDrawer', () => {
    it('should call closeBookingCreationDrawer from booking drawer composable', () => {
      const { closeDrawer } = useBookingConfiguration()

      closeDrawer()

      expect(closeBookingCreationDrawerMock).toHaveBeenCalled()
    })
  })

  describe('drawerTitle', () => {
    it('should return success title when on CONFIRMATION step with isSubmitSuccess true', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { goToNextStep, drawerTitle } = useBookingConfiguration()

      await goToNextStep() // INTRO -> CUSTOMIZE_MEETING
      await goToNextStep() // CUSTOMIZE_MEETING -> CONFIGURE_SLOTS
      await goToNextStep() // CONFIGURE_SLOTS -> CONFIRMATION + submit success

      expect(drawerTitle.value).toBe('booking-configuration.drawer-titles.confirmation-success')
    })

    it('should return step title when not on confirmation step', () => {
      const { drawerTitle } = useBookingConfiguration()

      expect(drawerTitle.value).toBe('booking-configuration.drawer-titles.intro')
    })
  })
})
