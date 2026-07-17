import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import { FeatureFlagManager } from '@pulse/common/managers'
import { Feature, RouteName } from '@pulse/common/enums'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

import { featureFlagGuard } from './feature-flag.guard'


const toNameMock = RouteName.INFO

describe('feature-flag.guard', () => {
  const tests = [{
    featureFlag: Feature.MAIL_TO_GED,
    featureFlagIsActivatedMock: false,
    expectedRouteName: 'Error404',
    expectedLoggerMock: `feature flag '${Feature.MAIL_TO_GED}' is not activated for route '${toNameMock}'`,
    reason: 'redirect to Error404 because the required feature flag is NOT activated',
  }, {
    featureFlag: Feature.MAIL_TO_GED,
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
  it.each(tests)('$reason', ({
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

    const result = featureFlagGuard(toRouteMock)

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
})
