import { AdminMsalService } from '@admin-tools/services/admin-msal/admin-msal.service'
import { logger } from '@pulse/toolbox'

export class LoginManager {
  static async initAuthSSO(): Promise<void> {
    await AdminMsalService.handleRedirectResult()
    await AdminMsalService.loginRedirect()
  }

  static async handleLogout(): Promise<void> {
    await AdminMsalService.logout()
  }

  /**
   * Clear all localStorage on logout
   * Admin-tools handles sensitive data, so we clear everything to ensure no data is left behind
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
