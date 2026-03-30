import type { Router } from 'vue-router'
import type { ComputedRef } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { CurrentUserManager } from '@pulse/common/managers'
import { setUnauthorizedCallback } from '@pulse/common/unauthorized-callback'
import { TokenRefreshService } from '@pulse/common/services/token-refresh'
import { MsalService } from '@pulse/common/services/msal'
import { Layout, RouteName } from '@pulse/common/enums'

export class CollaboratorAuthService {
  static init(router: Router, currentLayout: ComputedRef<Layout>) {
    CurrentUserManager.initToken()

    setUnauthorizedCallback(async () => {
      CurrentUserManager.persistToken('')

      // logout user everywhere but the login layout
      if (currentLayout.value !== Layout.LOGIN) {
        router.replace({ name: RouteName.LOGIN_COLLAB, query: { sessionExpired: 'true' } })
      }
    })

    TokenRefreshService.registerRefreshStrategy(async () => {
      const token = await MsalService.getFreshMSALToken()
      if (isNotNullNorEmpty(token) === false) {
        throw new Error('Failed to refresh MSAL token')
      }
      return token
    })
  }
}
