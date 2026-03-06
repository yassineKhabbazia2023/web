import { useBookingConfiguration } from './booking-configuration.composable'
import { BookingService } from '@booking/services'
import { BookingConfigurationManager } from './booking-configuration.manager'
import { BookingTrackingService } from '@booking/services/booking-tracking.service'
import { BookingConfigurationSteps } from './booking-configuration.enums'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { getInitialTimeSlotsConfiguration } from '../booking-time-slots-configuration/booking-time-slots-configuration.composable'
import type { BookingConfigurationResponse } from '@booking/types/booking.types'
import {
  getMockedTimeSlotsConfiguration,
  getMockedBookingConfigurationPayload,
  getMockedBookingConfigurationResponse,
  getMockedAppointmentDetails,
} from '@booking/__mocks__/booking.mock'

const closeBookingDrawerMock = vi.fn()

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
    closeBookingDrawer: closeBookingDrawerMock,
  }),
}))

describe('useBookingConfiguration', () => {
  beforeEach(() => {
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

      expect(vi.mocked(BookingTrackingService.trackCollaboratorConfigurationSubmitted)).toHaveBeenCalledWith(true)
    })

    it('should call BookingTrackingService.trackCollaboratorConfigurationSubmitted with false on failure', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration } = useBookingConfiguration()

      await expect(submitConfiguration()).rejects.toThrow('API Error')
      expect(vi.mocked(BookingTrackingService.trackCollaboratorConfigurationSubmitted)).toHaveBeenCalledWith(false)
    })

    it('should close booking drawer on success', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(closeBookingDrawerMock).toHaveBeenCalled()
    })

    it('should display success notification on successful submission', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { submitConfiguration } = useBookingConfiguration()

      await submitConfiguration()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('success', 'notifications.submit-success')
    })

    it('should display error notification on failed submission', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(new Error('API Error'))

      const { submitConfiguration } = useBookingConfiguration()

      await expect(submitConfiguration()).rejects.toThrow()

      expect(vi.mocked(displayNotification)).toHaveBeenCalledWith('error', 'notifications.submit-error')
    })

    it('should log error on failed submission', async () => {
      const error = new Error('API Error')
      vi.mocked(BookingService.submitBookingConfiguration).mockRejectedValueOnce(error)

      const { submitConfiguration } = useBookingConfiguration()

      await expect(submitConfiguration()).rejects.toThrow()

      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Failed to submit booking configuration', error)
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

      await expect(submitConfiguration()).rejects.toThrow()

      expect(isSubmitting.value).toBe(false)
    })
  })

  describe('goToNextStep on last step', () => {
    it('should submit configuration when on last step', async () => {
      vi.mocked(BookingService.submitBookingConfiguration).mockResolvedValueOnce(getMockedBookingConfigurationResponse())

      const { goToNextStep } = useBookingConfiguration()

      await goToNextStep() // INTRO -> CUSTOMIZE_MEETING
      await goToNextStep() // CUSTOMIZE_MEETING -> CONFIGURE_SLOTS
      await goToNextStep() // CONFIGURE_SLOTS -> submit

      expect(vi.mocked(BookingService.submitBookingConfiguration)).toHaveBeenCalled()
      expect(vi.mocked(BookingTrackingService.trackCollaboratorConfigurationSubmitted)).toHaveBeenCalledWith(true)
    })
  })
})
