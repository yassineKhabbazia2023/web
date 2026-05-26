import type { RouteLocationNormalizedGeneric, RouteLocationRaw } from 'vue-router'
import { Feature, RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { getIsMobile } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'

/**
 * Guard for the wallet folders ("portefeuille") landing route.
 * On mobile, the wallet only exposes prospects, so any attempt to reach the
 * folders landing is redirected to the prospects page.
 * Only applies when responsive and the prospect experience are both activated.
 */
export function collaboratorWalletFoldersGuard(
  to: RouteLocationNormalizedGeneric,
): RouteLocationRaw | undefined {
  const isResponsiveActivated = FeatureFlagManager.isResponsiveActivated()
  const isMobile = getIsMobile()
  const isProspectExperienceActivated = FeatureFlagManager.isFeatureActivated(Feature.PROSPECT_EXPERIENCE)

  if (isResponsiveActivated === true && isMobile === true && isProspectExperienceActivated === true) {
    logger.trace(`Wallet folders route '${String(to.name)}' is desktop-only on mobile, redirecting to prospects.`)
    return { name: RouteName.PROSPECTS }
  }
}
