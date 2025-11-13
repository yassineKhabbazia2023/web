import { AmplitudeService } from '@pulse/common/services/amplitude'

export class BookingTrackingManager {
  static trackBookingConfigurationViewStarted() {
    AmplitudeService.track('Booking Configuration View Started')
  }
}
