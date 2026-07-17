import * as mandateService from '@mandate/services/mandate'
import * as mandateUtils from '@mandate/helpers/utils'
import * as notificationHelper from '@mandate/helpers/NotificationHelper'
import { FeatureFlagManager } from '@pulse/common/managers'

export * from './mandate.mocks'

// Legacy behavior of the old automocks for the three spy-wrapped modules:
// every function no-ops. Consumer specs arm it per test (beforeEach); owner
// specs keep the real implementations.
export function armMandateModuleDefaults(): void {
  // The legacy '@pulse/common/managers' automock kept every feature flag off:
  // FeatureFlagManager is a static class, stubbed with a per-test vi.spyOn.
  vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(false)
  for (const wrappedModule of [mandateService, mandateUtils, notificationHelper]) {
    for (const exported of Object.values(wrappedModule)) {
      if (typeof exported === 'function') {
        vi.mocked(exported as (...args: unknown[]) => unknown).mockImplementation(() => undefined)
      }
    }
  }
}
