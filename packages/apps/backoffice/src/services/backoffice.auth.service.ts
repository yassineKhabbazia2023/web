import { CurrentUserManager } from '@pulse/common/managers'
import { TokenRefreshService } from '@pulse/common/services/token-refresh'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'

export class BackofficeAuthService {
  static init() {
    CurrentUserManager.initToken()

    TokenRefreshService.registerRefreshStrategy(async () => {
      const token = await AdminMsalService.getFreshMSALToken()
      if (token === null) {
        throw new Error('Failed to refresh Admin MSAL token')
      }
      return token
    })
  }
}
