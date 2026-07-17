import { AmplitudeService } from '@pulse/common/services/amplitude'
import { DelegationTrackingManager } from './delegation-tracking.manager'

describe('DelegationTrackingManager', () => {
  describe('trackPermanentDeleteRequested', () => {
    it('should track the event without properties', () => {
      DelegationTrackingManager.trackPermanentDeleteRequested()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Delegation Permanent Delete Requested',
      )
    })
  })

  describe('trackPermanentDeleteCompleted', () => {
    it('should track with succeeded result', () => {
      DelegationTrackingManager.trackPermanentDeleteCompleted('succeeded')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Delegation Permanent Delete Completed',
        { delegation_permanent_delete_completed_result: 'succeeded' },
      )
    })

    it('should track with failed result', () => {
      DelegationTrackingManager.trackPermanentDeleteCompleted('failed')

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledExactlyOnceWith(
        'Delegation Permanent Delete Completed',
        { delegation_permanent_delete_completed_result: 'failed' },
      )
    })
  })
})
