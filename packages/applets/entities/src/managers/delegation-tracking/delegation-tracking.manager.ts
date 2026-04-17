import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AmplitudeEvent } from '@pulse/common/enums'

export class DelegationTrackingManager {
  static trackPermanentDeleteRequested() {
    AmplitudeService.track(AmplitudeEvent.DELEGATION_PERMANENT_DELETE_REQUESTED)
  }

  static trackPermanentDeleteCompleted(result: 'succeeded' | 'failed') {
    AmplitudeService.track(AmplitudeEvent.DELEGATION_PERMANENT_DELETE_COMPLETED, {
      delegation_permanent_delete_completed_result: result,
    })
  }
}
