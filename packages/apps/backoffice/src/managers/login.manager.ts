import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { CurrentUserManager } from '@pulse/common/managers'
import { logger } from '@pulse/toolbox'

export class LoginManager {
  static async initAuthSSO(): Promise<void> {
    const isAuthenticated = await AdminMsalService.handleRedirectResult()

    if (isAuthenticated === true) {
      const msalToken = await AdminMsalService.getMSALToken()

      if (msalToken === null) {
        await AdminMsalService.loginRedirect()
        return
      }

      CurrentUserManager.persistToken(msalToken)
      return
    }

    await AdminMsalService.loginRedirect()
  }

  static async handleLogout(): Promise<void> {
    await AdminMsalService.logout()
  }

  /**
   * Clear all localStorage on logout
   * Backoffice handles sensitive data, so we clear everything to ensure no data is left behind
   */
  static clearAuthStorage(): void {
    try {
      globalThis.localStorage.clear()
      logger.info('Auth storage cleared successfully')
    } catch (error) {
      logger.error('Failed to clear auth storage:', error)
    }
  }
}
