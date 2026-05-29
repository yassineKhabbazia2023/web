import { App } from 'vue'
import { LoginService } from '@pulse/common/services/login'
import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'

import { MsalLoginStrategy, MsalLogoutStrategy, MsalTokenStrategy } from '../../services/msal/msal.strategy'

export default {
  install(_app: App) {
    // Register collaborator-specific strategies for shared auth services so
    // the login flow, CurrentUserManager.logout and the request-token
    // interceptor have a strategy to delegate to.
    LoginService.registerSsoStrategy(new MsalLoginStrategy())
    LogoutService.registerStrategy(new MsalLogoutStrategy())
    TokenProviderService.registerProviderStrategy(new MsalTokenStrategy())
  },
}
