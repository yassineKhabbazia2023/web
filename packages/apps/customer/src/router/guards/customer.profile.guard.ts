import type { RouteLocationNormalizedGeneric, RouteLocationRaw } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { getEffectiveIsMobile } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'

/**
 * Guard for profile routes (mobile-only)
 * Redirects to landing page if the user is not on mobile device.
 */
export function customerProfileGuard(
  to: RouteLocationNormalizedGeneric,
): RouteLocationRaw | undefined {
  const isMobile = getEffectiveIsMobile()

  if (isMobile === false) {
    logger.trace(`Profile route '${String(to.name)}' is mobile-only, redirecting to landing page.`)
    return { name: RouteName.LANDING }
  }
}
