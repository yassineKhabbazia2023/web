import { App } from 'vue'
import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'

import { MsalLogoutStrategy, MsalTokenStrategy } from '../../services/msal/msal.strategy'

export default {
  install(_app: App) {
    // Register collaborator-specific strategies for shared auth services so
    // CurrentUserManager.logout and the request-token interceptor have a
    // strategy to delegate to.
    LogoutService.registerStrategy(new MsalLogoutStrategy())
    TokenProviderService.registerProviderStrategy(new MsalTokenStrategy())
  },
}
