import type { NavigationGuard, RouteLocationNormalizedGeneric } from 'vue-router'
import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import { logger, FeatureFlagManager } from '@pulse/core'
import type { Feature } from '@pulse/core/enums'

export const featureFlagGuard: NavigationGuard = (to: RouteLocationNormalizedGeneric, _from, next) => {
  const toFeatureFlag = to.meta[FEATURE_FLAG_META] as Feature | undefined
  const toName = to.name as string

  if(
    toFeatureFlag !== undefined
    && FeatureFlagManager.isFeatureActivated(toFeatureFlag) === false
  ) {
    logger.trace(`feature flag '${toFeatureFlag}' is not activated for route '${toName}'`)
    // redirect to 404
    return next({ name: RouteName.ERROR404 })
  }

  return next()
}
