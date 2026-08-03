import { AmplitudeService } from '@pulse/common/services/amplitude'

export class InviteUserTracking {

  static trackOnboardingRelaunchedSuccess() {
    AmplitudeService.track('Onboarding Relaunched', {
      onboarding_relaunch_result: 'succeeded',
    })
  }

  static trackOnboardingRelaunchedFail() {
    AmplitudeService.track('Onboarding Relaunched', {
      onboarding_relaunch_result: 'failed',
    })
  }
}
