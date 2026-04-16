import { PERMISSIONS_META } from '@pulse/common/constants'
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { CustomerLandingManager } from '@customer/managers/customer-landing.manager'
import { CurrentUserManager } from '@pulse/common/managers'

export async function customerPermissionGuard(to: RouteLocationNormalizedGeneric) {
  const permissions = to.meta?.[PERMISSIONS_META]
  const toName = to.name as string
  if (permissions !== undefined && CurrentUserManager.hasPermission(permissions) === false) {
    const targetRoute = CustomerLandingManager.getLandingPage()
    logger.trace(`Unauthorized access to page '${toName}', redirects to landing page.`)
    return { name: targetRoute?.name }
  }
}
