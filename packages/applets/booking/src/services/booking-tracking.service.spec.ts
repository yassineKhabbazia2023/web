import { AmplitudeService } from '@pulse/common/services/amplitude'
import { BookingTrackingService } from './booking-tracking.service'

vi.mock('@pulse/common/services/amplitude')

describe('BookingTrackingService', () => {
  describe('trackConfigurationOpened', () => {
    it('should track Booking Configuration View Started event', () => {
      BookingTrackingService.trackConfigurationOpened()
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Configuration View Started',
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

  describe('trackBookingConsulted', () => {
    it('should track Feature consulted event with feature_name rdv', () => {
      BookingTrackingService.trackBookingConsulted()
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Feature consulted',
        { feature_name: 'rdv' },
      )
    })
  })

  describe('trackPastMeetingsConsulted', () => {
    it('should track Booking Past Meetings Consulted event', () => {
      BookingTrackingService.trackPastMeetingsConsulted()
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Past Meetings Consulted',
      )
    })
  })

  describe('trackCustomerBookingFlowStarted', () => {
    it('should track Booking Appointment Started event', () => {
      BookingTrackingService.trackCustomerBookingFlowStarted()
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Appointment Started',
      )
    })
  })

  describe('trackBookingMeetingConsulted', () => {
    it('should track Booking Meeting Consulted event with source', () => {
      BookingTrackingService.trackBookingMeetingConsulted('testSource')
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Meeting Consulted',
        { booking_meeting_consulted_source: 'testSource' },
      )
    })
  })

  describe('trackMeetingJoinRequested', () => {
    it('should track Booking Meeting Join Requested event with source', () => {
      BookingTrackingService.trackMeetingJoinRequested('testSource')
      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Booking Meeting Join Requested',
        { booking_meeting_join_source: 'testSource' },
      )
    })
  })
})
