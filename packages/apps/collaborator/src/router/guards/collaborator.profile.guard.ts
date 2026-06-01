import type { RouteLocationNormalizedGeneric, RouteLocationRaw } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getEffectiveIsMobile } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'

/**
 * Guard for profile routes (mobile-only)
 * Redirects to landing page if:
 * - Responsive feature flag is not activated
 * - User is not on mobile device
 */
export function collaboratorProfileGuard(
  to: RouteLocationNormalizedGeneric,
): RouteLocationRaw | undefined {
  const isResponsiveActivated = FeatureFlagManager.isResponsiveActivated()
  const isMobile = getEffectiveIsMobile()

  if (isResponsiveActivated === false || isMobile === false) {
    logger.trace(`Profile route '${String(to.name)}' is mobile-only, redirecting to landing page.`)
    return { name: RouteName.LANDING }
  }
}
