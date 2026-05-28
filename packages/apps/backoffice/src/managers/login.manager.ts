import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { logger } from '@pulse/toolbox'
import { useTokenStore, tokenIsValid } from '@pulse/common/stores'

export class LoginManager {
  static async initAuthSSO(): Promise<void> {
    await AdminMsalService.handleRedirectResult()
    await AdminMsalService.loginRedirect()
  }

  /**
   * Seed the shared token store with the current MSAL access token so the common
   * request interceptor can attach (and later refresh) it. Called from the
   * authentication guard once the user is known to be authenticated.
   */
  static async syncToken(): Promise<void> {
    const token = await AdminMsalService.getMSALToken()
    const tokenStore = useTokenStore()

    if (tokenIsValid(token)) {
      tokenStore.setToken(token)
      return
    }

    tokenStore.removeToken()
  }

  static async handleLogout(): Promise<void> {
    useTokenStore().removeToken()
    await AdminMsalService.logout()
  }

  /**
   * Clear all localStorage on logout
   * Backoffice handles sensitive data, so we clear everything to ensure no data is left behind
   */
  static clearAuthStorage(): void {
    try {
      globalThis.localStorage.clear()
      useTokenStore().removeToken()
      logger.info('Auth storage cleared successfully')
    } catch (error) {
      logger.error('Failed to clear auth storage:', error)
    }
  }
}
