import type { Router } from 'vue-router'
import type { ComputedRef } from 'vue'
import { CurrentUserManager } from '@pulse/common/managers'
import { setUnauthorizedCallback } from '@pulse/common/unauthorized-callback'
import { TokenRefreshService } from '@pulse/common/services/token-refresh'
import { refreshClientToken } from '@pulse/common/services/authentication'
import { Layout } from '@pulse/common/enums'
import { CustomerAnonymousFlowManager } from '../managers/customer.anonymous.flow.manager'

export class CustomerAuthService {
  static init(router: Router, currentLayout: ComputedRef<Layout>) {
    CurrentUserManager.initToken()

    setUnauthorizedCallback(async () => {
      CurrentUserManager.persistToken('')

      // logout user everywhere but the login layout
      if (currentLayout.value !== Layout.LOGIN) {
        await CurrentUserManager.logout()
        const anonymousLandingPage = CustomerAnonymousFlowManager.getLandingPage()
        router.replace({ ...anonymousLandingPage, query: { sessionExpired: 'true' } })
      }
    })

    TokenRefreshService.registerRefreshStrategy(refreshClientToken)
  }
}
