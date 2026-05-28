import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { FeatureFlagManager } from '@pulse/common/managers'

export function featureFlagGuard(to: RouteLocationNormalizedGeneric) {
  const toFeatureFlag = to.meta[FEATURE_FLAG_META]

  if (toFeatureFlag === undefined) {
    return
  }

  const toName = to.name as string

  if (FeatureFlagManager.isFeatureActivated(toFeatureFlag) === false) {
    logger.trace(`feature flag '${toFeatureFlag}' is not activated for route '${toName}'`)
    // Act as if the route doesn't exist, redirect to 404
    return { name: RouteName.ERROR404 }
  }
}
