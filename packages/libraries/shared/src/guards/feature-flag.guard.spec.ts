import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'
import { Feature, RouteName } from '@pulse/common/enums'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

import { featureFlagGuard } from './feature-flag.guard'


const toNameMock = RouteName.INFO

describe('feature-flag.guard', () => {
  beforeEach(() => {
    vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false)
    vi.spyOn(CurrentUserManager, 'ensureUserContext').mockResolvedValue(undefined)
  })

  const tests = [{
    featureFlag: Feature.MAIL_TO_PENNYLANE,
    featureFlagIsActivatedMock: false,
    expectedRouteName: 'Error404',
    expectedLoggerMock: `feature flag '${Feature.MAIL_TO_PENNYLANE}' is not activated for route '${toNameMock}'`,
    reason: 'redirect to Error404 because the required feature flag is NOT activated',
  }, {
    featureFlag: Feature.MAIL_TO_PENNYLANE,
    featureFlagIsActivatedMock: true,
    expectedRouteName: undefined,
    expectedLoggerMock: undefined,
    reason: 'keep the route because the required feature flag is activated',
  }, {
    featureFlag: undefined,
    featureFlagIsActivatedMock: true,
    expectedRouteName: undefined,
    expectedLoggerMock: undefined,
    reason: 'keep the route because the no feature flag is required',
  }, {
    featureFlag: Feature.PROSPECT_EXPERIENCE,
    featureFlagIsActivatedMock: false,
    expectedRouteName: 'Error404',
    expectedLoggerMock: `feature flag '${Feature.PROSPECT_EXPERIENCE}' is not activated for route '${toNameMock}'`,
    reason: 'redirect to Error404 when feature flag is NOT activated',
  }, {
    featureFlag: Feature.PROSPECT_EXPERIENCE,
    featureFlagIsActivatedMock: true,
    expectedRouteName: undefined,
    expectedLoggerMock: undefined,
    reason: 'keep the route when feature flag is activated',
  }]
  it.each(tests)('$reason', async ({
    featureFlag,
    featureFlagIsActivatedMock,
    expectedRouteName,
    expectedLoggerMock,
  }) => {
    vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(featureFlagIsActivatedMock)
    const toRouteMock = {
      name: toNameMock,
      meta: {
        [FEATURE_FLAG_META]: featureFlag,
      },
    } as unknown as RouteLocationNormalizedGeneric

    const result = await featureFlagGuard(toRouteMock)

    if (featureFlag !== undefined) {
      expect(FeatureFlagManager.isFeatureActivated).toHaveBeenCalledWith(featureFlag)
    }

    if (expectedLoggerMock === undefined) {
      expect(loggerMock.trace).not.toHaveBeenCalled()
    } else {
      expect(loggerMock.trace).toHaveBeenCalledExactlyOnceWith(expectedLoggerMock)
    }

    if (expectedRouteName === undefined) {
      expect(result).toBeUndefined()
    } else {
      expect(result).toEqual({ name: expectedRouteName })
    }
  })

  describe('user identification', () => {
    const flaggedRouteMock = {
      name: toNameMock,
      meta: { [FEATURE_FLAG_META]: Feature.PROSPECT_EXPERIENCE },
    } as unknown as RouteLocationNormalizedGeneric

    // Flags can target a specific user: evaluating before the provider knows the
    // identity denies the route to the very users it targets
    it('should identify the authenticated user before evaluating the flag', async () => {
      vi.mocked(CurrentUserManager.isAuthenticated).mockReturnValue(true)
      vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockImplementation(() => {
        expect(CurrentUserManager.ensureUserContext).toHaveBeenCalled()
        return true
      })

      await featureFlagGuard(flaggedRouteMock)

      expect(CurrentUserManager.ensureUserContext).toHaveBeenCalled()
    })

    it('should not identify an anonymous user', async () => {
      vi.mocked(CurrentUserManager.isAuthenticated).mockReturnValue(false)
      vi.spyOn(FeatureFlagManager, 'isFeatureActivated').mockReturnValue(true)

      await featureFlagGuard(flaggedRouteMock)

      expect(CurrentUserManager.ensureUserContext).not.toHaveBeenCalled()
    })

    it('should not identify anyone on a route without a feature flag', async () => {
      vi.mocked(CurrentUserManager.isAuthenticated).mockReturnValue(true)

      await featureFlagGuard({ name: toNameMock, meta: {} } as unknown as RouteLocationNormalizedGeneric)

      expect(CurrentUserManager.ensureUserContext).not.toHaveBeenCalled()
    })
  })
})
