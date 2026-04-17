import { AmplitudeService } from '@pulse/common/services/amplitude'

export class HistoryTrackingManager {
  static trackFilterValidated() {
    AmplitudeService.track('History Filter Validated')
  }
}
