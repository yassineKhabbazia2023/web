import type { RouteLocationNormalizedGeneric } from 'vue-router'
import { CurrentUserManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'
import { CustomerLandingManager } from '@customer/managers/customer-landing.manager'

export async function customerWalletGuard(to: RouteLocationNormalizedGeneric) {
  if (to.name !== RouteName.WALLET) {
    return
  }

  await CurrentUserManager.ensureUserContext()
  return CustomerLandingManager.getWalletDefaultTab()
}
