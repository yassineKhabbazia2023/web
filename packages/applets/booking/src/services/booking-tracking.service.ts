import { AmplitudeService } from '@pulse/common/services/amplitude'

export class BookingTrackingService {
  static trackCollaboratorWidgetOpened() {
    AmplitudeService.track('Booking Configuration View Started', {})
  }

  static trackCollaboratorConfigurationSubmitted(hasBeenSuccessful: boolean) {
    AmplitudeService.track(
      'Booking Configuration View Completed',
      {
        booking_config_view_completed_result: hasBeenSuccessful ? 'succeeded' : 'failed',
      })
  }
}
