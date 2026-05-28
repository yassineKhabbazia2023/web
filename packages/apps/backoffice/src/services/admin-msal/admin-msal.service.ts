import { logger } from '@pulse/toolbox'
import {
  AccountInfo,
  AuthenticationResult,
  Configuration,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser'
import {
  VITE_MSAL_CLIENT_ID,
  VITE_MSAL_REDIRECT_URI,
  VITE_MSAL_POST_LOGOUT_REDIRECT_URI,
  VITE_MSAL_AUTHORITY,
} from 'env-vars'
import {
  MSAL_SCOPES,
} from '@backoffice/constants/backoffice.const'

export class AdminMsalService {
  private static instance: PublicClientApplication | null = null
  private static initializationFailed: boolean = false
  private static readonly interactionKey = 'msal.interaction.status'

  private constructor() {
    // Private constructor to prevent instantiation
  }

  private static getConfiguration(): Configuration {
    return {
      auth: {
        clientId: VITE_MSAL_CLIENT_ID,
        authority: VITE_MSAL_AUTHORITY,
        redirectUri: VITE_MSAL_REDIRECT_URI,
        postLogoutRedirectUri: VITE_MSAL_POST_LOGOUT_REDIRECT_URI,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false,
      },
    }
  }

  private static async getInstance(): Promise<PublicClientApplication | null> {
    // If initialization already failed, return null immediately
    if (AdminMsalService.initializationFailed === true) {
      return null
    }

    if (AdminMsalService.instance === null || AdminMsalService.instance === undefined) {
      try {
        const msal = new PublicClientApplication(AdminMsalService.getConfiguration())
        await msal.initialize()
        const response = await msal.handleRedirectPromise()

        if (response?.account) {
          msal.setActiveAccount(response.account)
        }

        AdminMsalService.instance = msal
      } catch (error) {
        AdminMsalService.initializationFailed = true
        logger.error('Failed to initialize MSAL. The application requires HTTPS to function properly.', error)
        return null
      }
    }

    return AdminMsalService.instance
  }

  static async getAccount(): Promise<AccountInfo | null> {
    const instance = await AdminMsalService.getInstance()
    if (instance === null) {
      return null
    }
    const accounts = instance.getAllAccounts()
    return accounts[0] || null
  }

  static async loginRedirect(request?: RedirectRequest): Promise<void> {
    const instance = await AdminMsalService.getInstance()
    if (instance === null) {
      logger.warn('Cannot login: MSAL is not initialized')
      return
    }
    /**
     * remove this key msal.interaction.status to prevent error when page was restored from bfcache
     */
    const status = sessionStorage.getItem(AdminMsalService.interactionKey)
    if (status) {
      sessionStorage.removeItem(AdminMsalService.interactionKey)
    }
    await instance.loginRedirect(request)
  }

  static async logout(): Promise<void> {
    const instance = await AdminMsalService.getInstance()
    if (instance === null) {
      logger.warn('Cannot logout: MSAL is not initialized')
      return
    }
    instance.logoutRedirect()
  }

  static async isUserAuthenticated(): Promise<boolean> {
    const account = await AdminMsalService.getAccount()
    return account !== null
  }

  static async handleRedirectResult(): Promise<boolean> {
    const instance = await AdminMsalService.getInstance()
    if (instance === null) {
      return false
    }
    return instance.getActiveAccount() !== null
  }

  static async acquireTokenSilent(userRequest: SilentRequest): Promise<AuthenticationResult | null> {
    const instance = await AdminMsalService.getInstance()
    if (instance === null) {
      logger.warn('Cannot acquire token: MSAL is not initialized')
      return null
    }
    return await instance.acquireTokenSilent(userRequest)
  }

  static async getMSALToken(forceRefresh: boolean = false): Promise<string | null> {
    const account = await AdminMsalService.getAccount()
    if (account === null) {
      return null
    }

    const silentRequest: SilentRequest = {
      account,
      scopes: MSAL_SCOPES,
      forceRefresh,
    }

    const instance = await AdminMsalService.getInstance()
    if (instance === null) {
      return null
    }
    try {
      const response = await instance.acquireTokenSilent(silentRequest)
      if (response?.accessToken) {
        return response.accessToken
      }
    } catch (error) {
      logger.warn('Failed to retrieve MSAL token:', error)
    }

    return null
  }

  static async getFreshMSALToken(): Promise<string | null> {
    return await AdminMsalService.getMSALToken(true)
  }
}
