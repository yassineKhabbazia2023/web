import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { CurrentUserManager, FeatureFlagManager } from '@pulse/common/managers'

export async function featureFlagGuard(to: RouteLocationNormalizedGeneric) {
  const toFeatureFlag = to.meta[FEATURE_FLAG_META]

  if (toFeatureFlag === undefined) {
    return
  }

  // Flags can target a specific user, so the provider must know who is evaluating
  // before we read one, otherwise a flagged route is denied to the very users it
  // targets. Resolved once per session, so this is a no-op after the first route.
  if (CurrentUserManager.isAuthenticated()) {
    await CurrentUserManager.ensureUserContext()
  }

  const toName = to.name as string

  if (FeatureFlagManager.isFeatureActivated(toFeatureFlag) === false) {
    logger.trace(`feature flag '${toFeatureFlag}' is not activated for route '${toName}'`)
    // Act as if the route doesn't exist, redirect to 404
    return { name: RouteName.ERROR404 }
  }
}
