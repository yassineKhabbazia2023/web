import { MsalService } from '@admin-tools/services/msal.service'

export class LoginManager {
  static async initAuthSSO(): Promise<void> {
    await MsalService.handleRedirectResult()
    return MsalService.loginRedirect()
  }

  static async handleLogout(): Promise<void> {
    return MsalService.logout()
  }

  static clearLocalStorage(): void {
    return window.localStorage.clear()
  }
}
