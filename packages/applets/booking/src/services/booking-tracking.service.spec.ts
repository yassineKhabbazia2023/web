import { AmplitudeService } from '@pulse/common/services/amplitude'
import { BookingTrackingService } from './booking-tracking.service'

vi.mock('@pulse/common/services/amplitude')

describe('BookingTrackingService', () => {
  describe('trackCollaboratorWidgetOpened', () => {
    it('should track Booking Configuration View Started event', () => {
      BookingTrackingService.trackCollaboratorWidgetOpened()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Configuration View Started',
        {},
      )
    })
  })

  describe('trackCollaboratorConfigurationSubmitted', () => {
    it('should track succeeded result when hasBeenSuccessful is true', () => {
      BookingTrackingService.trackCollaboratorConfigurationSubmitted(true)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Configuration View Completed',
        { booking_config_view_completed_result: 'succeeded' },
      )
    })

    it('should track failed result when hasBeenSuccessful is false', () => {
      BookingTrackingService.trackCollaboratorConfigurationSubmitted(false)

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Configuration View Completed',
        { booking_config_view_completed_result: 'failed' },
      )
    })
  })
})
