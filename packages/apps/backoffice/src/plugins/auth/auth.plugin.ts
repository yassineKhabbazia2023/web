import type { App } from 'vue'
import { TokenProviderService } from '@pulse/common/services/token-provider'
import { useTokenStore } from '@pulse/common/stores'

import { AdminMsalTokenStrategy } from '@backoffice/services/admin-msal/admin-msal.strategy'

export default {
  install(_app: App) {
    // Register the backoffice MSAL strategy on the shared token-provider service
    // so the common request interceptor can refresh the Azure AD token, just
    // like the customer (Gigya) and collaborator (MSAL) apps do.
    TokenProviderService.registerProviderStrategy(new AdminMsalTokenStrategy())

    // The backoffice handles sensitive data: keep the token in memory only and
    // never persist it to localStorage. The authentication guard re-seeds it
    // from MSAL on every navigation, so no persistence is needed.
    useTokenStore().setTokenPersistence(false)
  },
}
