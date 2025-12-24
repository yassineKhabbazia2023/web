import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import { featureFlagManagerMock } from '@pulse/common/mocks'
import { Feature, RouteName } from '@pulse/common/enums'
import type { RouteLocationNormalizedGeneric } from 'vue-router'


import { featureFlagGuard } from './feature-flag.guard'

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: featureFlagManagerMock,
}))

const fromRouteMock = { name: RouteName.HOMEPAGE } as RouteLocationNormalizedGeneric
const nextMock = vi.fn(() => true)
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

    const response = featureFlagGuard(toRouteMock, fromRouteMock, nextMock)

    expect(response).toBe(true)
    expect(nextMock).toHaveBeenCalledOnce()

    if (expectedLoggerMock === undefined) {
      expect(loggerMock.trace).not.toHaveBeenCalled()
    } else {
      expect(loggerMock.trace).toHaveBeenCalledExactlyOnceWith(expectedLoggerMock)
    }

    if (expectedRouteName === undefined) {
      expect(nextMock).toHaveBeenCalledWith(/* no args */)
    } else {
      const expectedParameters = { name: expectedRouteName }

      expect(nextMock).toHaveBeenCalledWith(expectedParameters)
    }
  })
})
