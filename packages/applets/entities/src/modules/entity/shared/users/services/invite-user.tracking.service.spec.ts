import { AmplitudeService } from '@pulse/common/services/amplitude'
import { InviteUserTracking } from './invite-user.tracking.service'

describe('InviteUserTracking', () => {
  describe('trackOnboardingRelaunchedSuccess', () => {
    it('should track onboarding relaunched with succeeded result', () => {
      InviteUserTracking.trackOnboardingRelaunchedSuccess()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Onboarding Relaunched',
        {
          onboarding_relaunch_result: 'succeeded',
        },
      )
    })
  })

  describe('trackOnboardingRelaunchedFail', () => {
    it('should track onboarding relaunched with failed result', () => {
      InviteUserTracking.trackOnboardingRelaunchedFail()

      expect(vi.mocked(AmplitudeService.track)).toHaveBeenCalledWith(
        'Onboarding Relaunched',
        {
          onboarding_relaunch_result: 'failed',
        },
      )
    })
  })
})
