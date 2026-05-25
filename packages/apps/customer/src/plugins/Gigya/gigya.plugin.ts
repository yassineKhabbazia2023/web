import { App } from 'vue'
import { VITE_GIGYA_KEY, VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { LoginService } from '@pulse/common/services/login'
import { LogoutService } from '@pulse/common/services/logout'
import { TokenProviderService } from '@pulse/common/services/token-provider'

import { GigyaLoginStrategy, GigyaLogoutStrategy, GigyaTokenStrategy } from './gigya.strategy'

export default {
  install(_app: App) {
    if (VITE_GIGYA_SSO_ACTIVATED === 'true' && VITE_GIGYA_KEY) {
      const firstScriptElement = document.getElementsByTagName('script')[0]
      const element = document.createElement('script')
      element.async = true
      element.src = `https://cdns.gigya.com/js/gigya.js?apiKey=${VITE_GIGYA_KEY}`
      firstScriptElement?.parentNode?.insertBefore(element, firstScriptElement)
    }

    // Register customer-specific strategies for shared auth services. These run
    // unconditionally so the shared services have a strategy to delegate to,
    // even when the Gigya SSO flag is off (each strategy guards its own SDK calls).
    LoginService.registerStrategy(new GigyaLoginStrategy())
    LogoutService.registerStrategy(new GigyaLogoutStrategy())
    TokenProviderService.registerProviderStrategy(new GigyaTokenStrategy())
  },
}
