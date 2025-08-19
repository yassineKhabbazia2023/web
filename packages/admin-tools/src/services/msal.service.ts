import {
  AccountInfo,
  Configuration,
  PublicClientApplication,
  RedirectRequest,
} from '@azure/msal-browser'
import {
  MSAL_AUTHORITY,
  MSAL_CLIENT_ID,
  MSAL_POST_LOGOUT_REDIRECT_URI,
  MSAL_REDIRECT_URI,
} from '@admin-tools/constants/admin-tool.const'

export class MsalService {
  private static instance: PublicClientApplication
  private static readonly interactionKey = 'msal.interaction.status'

  private constructor() {
    // Private constructor to prevent instantiation
  }

  private static getConfiguration(): Configuration {
    return {
      auth: {
        clientId: MSAL_CLIENT_ID,
        authority: MSAL_AUTHORITY,
        redirectUri: MSAL_REDIRECT_URI,
        postLogoutRedirectUri: MSAL_POST_LOGOUT_REDIRECT_URI,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      },
    }
  }

  private static async getInstance(): Promise<PublicClientApplication> {
    if (MsalService.instance === null || MsalService.instance === undefined) {
      const msal = new PublicClientApplication(MsalService.getConfiguration())
      await msal.initialize()
      const response = await msal.handleRedirectPromise()

      if (response?.account) {
        msal.setActiveAccount(response.account)
      }

      MsalService.instance = msal
    }

    return MsalService.instance
  }

  static async getAccount(): Promise<AccountInfo | null> {
    const instance = await MsalService.getInstance()
    const accounts = instance.getAllAccounts()
    return accounts[0] || null
  }

  static async loginRedirect(request?: RedirectRequest): Promise<void> {
    /**
     * remove this key msal.interaction.status to prevent error when page was restored from bfcache
     */
    const status = sessionStorage.getItem(MsalService.interactionKey)
    if (status) {
      sessionStorage.removeItem(MsalService.interactionKey)
    }
    const instance = await MsalService.getInstance()
    await instance.loginRedirect(request)
  }

  static async logout(): Promise<void> {
    const instance = await MsalService.getInstance()
    instance.logoutRedirect()
  }

  static async isUserAuthenticated(): Promise<boolean> {
    const account = await MsalService.getAccount()
    return account !== null
  }

  static async handleRedirectResult(): Promise<boolean> {
    const instance = await MsalService.getInstance()
    return instance.getActiveAccount() !== null
  }
}
