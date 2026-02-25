import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import { featureFlagManagerMock } from '@pulse/common/mocks/vitest'
import { Feature, RouteName } from '@pulse/common/enums'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

import { featureFlagGuard } from './feature-flag.guard'

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: featureFlagManagerMock,
}))

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
  }]
  it.each(tests)('$reason', ({
    featureFlag,
    featureFlagIsActivatedMock,
    expectedRouteName,
    expectedLoggerMock,
  }) => {
    featureFlagManagerMock.isFeatureActivated.mockReturnValue(featureFlagIsActivatedMock)
    const toRouteMock = {
      name: toNameMock,
      meta: {
        [FEATURE_FLAG_META]: featureFlag,
      },
    } as unknown as RouteLocationNormalizedGeneric

    const result = featureFlagGuard(toRouteMock)

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
