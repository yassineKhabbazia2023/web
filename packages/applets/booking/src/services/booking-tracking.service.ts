import { AmplitudeService } from '@pulse/common/services/amplitude'

export class BookingTrackingService {
  static trackConfigurationOpened(source: string) {
    AmplitudeService.track('Booking Configuration View Started', {
      booking_configuration_start_source: source,
    })
  }

  static trackCollaboratorConfigurationSubmitted(hasBeenSuccessful: boolean, enabledDays?: string[]) {
    AmplitudeService.track(
      'Booking Configuration View Completed',
      {
        booking_configuration_completed_result: hasBeenSuccessful ? 'succeeded' : 'failed',
        booking_configuration_completed_days: enabledDays,
      })
  }

  static trackLinkSignatureConsulted() {
    AmplitudeService.track('Booking Link Signature Consulted')
  }

  static trackLinkSignatureCopied(hasBeenSuccessful: boolean) {
    AmplitudeService.track('Booking Link Signature Copied', {
      booking_link_signature_copied_result: hasBeenSuccessful ? 'succeeded' : 'failed',
    })
  }

  static trackSlotModificationStarted() {
    AmplitudeService.track('Booking Slot Modification Started')
  }

  static trackSlotModificationValidated(hasBeenSuccessful: boolean) {
    AmplitudeService.track('Booking Slot Modification Validated', {
      booking_slot_modification_validated_result: hasBeenSuccessful ? 'succeeded' : 'failed',
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
