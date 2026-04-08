import { AmplitudeService } from '@pulse/common/services/amplitude'

export class BookingTrackingService {
  static trackConfigurationOpened() {
    AmplitudeService.track('Booking Configuration View Started')
  }

  static trackCollaboratorConfigurationSubmitted(hasBeenSuccessful: boolean) {
    AmplitudeService.track(
      'Booking Configuration View Completed',
      {
        booking_config_view_completed_result: hasBeenSuccessful ? 'succeeded' : 'failed',
      })
  }

  static trackBookingConsulted() {
    AmplitudeService.track('Feature consulted', {
      feature_name: 'rdv',
    })
  }

  static trackPastMeetingsConsulted() {
    AmplitudeService.track('Booking Past Meetings Consulted')
  }

  static trackCustomerBookingFlowStarted() {
    AmplitudeService.track('Booking Appointment Started')
  }

  static trackBookingMeetingConsulted(source: string) {
    AmplitudeService.track('Booking Meeting Consulted', {
      booking_meeting_consulted_source: source,
    })
  }

  static trackMeetingJoinRequested(source: string) {
    AmplitudeService.track('Booking Meeting Join Requested', {
      booking_meeting_join_source: source,
    })
  }
}
