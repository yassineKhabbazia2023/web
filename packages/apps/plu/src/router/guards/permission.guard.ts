import { PERMISSIONS_META } from '@pulse/common/constants'
import { NavigationGuard } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { CurrentUserManager } from '@pulse/common/managers'
import type { RouteLocationNormalizedGeneric } from 'vue-router'

export const permissionGuard: NavigationGuard = async (
  to: RouteLocationNormalizedGeneric,
  _from: RouteLocationNormalizedGeneric,
  next: Function,
) => {
  const permissions = to.meta?.[PERMISSIONS_META]
  const toName = to.name as string
  if (permissions !== undefined && CurrentUserManager.hasPermission(permissions) === false) {
    const targetRoute = AuthenticatedFlowManager.getLandingPage()
    logger.trace(`Unauthorized access to page '${toName}', redirects to landing page.`)
    return next({ name: targetRoute?.name })
  }

  return next()
}
