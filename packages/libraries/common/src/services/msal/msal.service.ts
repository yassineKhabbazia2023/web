import { logger } from '@pulse/core'
import {
  AccountInfo,
  AuthenticationResult,
  Configuration,
  PublicClientApplication,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser'
import {
  VITE_API_MSAL_CLIENT_ID,
  VITE_API_MSAL_AUTHORITY,
  VITE_API_MSAL_REDIRECT_URI,
  VITE_API_MSAL_SCOPE,
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
} from 'env-vars'
import { SQUAD_ROUTE_PATHS } from '@pulse/common/constants'

export class MsalService {
  private static instance: PublicClientApplication
  private static readonly interactionKey = 'msal.interaction.status'

  private constructor() {
    // Private constructor to prevent instantiation
  }

  /**
   * Update the URL based on the sub-environment for Multifront
   * Ex: https://localhost:9000/collaborateur transform to https://localhost:9000/transverse/collaborateur in sub-environment 'transverse'
   */
  private static getRedirectUri(uriOriginal: string): string {
    const url = window.location.href
    const envCollection = Object.values(SQUAD_ROUTE_PATHS)
    const env = envCollection.find(e => url.includes(e)) ?? ''
    return uriOriginal.replace('/collaborateur', env.concat('/collaborateur'))
  }

  private static getConfiguration(): Configuration {
    return {
      auth: {
        clientId: VITE_API_MSAL_CLIENT_ID,
        authority: VITE_API_MSAL_AUTHORITY,
        redirectUri: MsalService.getRedirectUri(VITE_API_MSAL_REDIRECT_URI),
        postLogoutRedirectUri: MsalService.getRedirectUri(VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI),
      },
      cache: {
        cacheLocation: 'sessionStorage',
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

  static async acquireTokenSilent(userRequest: SilentRequest): Promise<AuthenticationResult> {
    const instance = await MsalService.getInstance()
    return await instance.acquireTokenSilent(userRequest)
  }

  static async getMSALToken() {
    const account = await MsalService.getAccount()
    if (!account) {
      return null
    }

    const silentRequest: SilentRequest = {
      account,
      scopes: [VITE_API_MSAL_SCOPE],
    }
    const instance = await MsalService.getInstance()
    try {
      const response = await instance.acquireTokenSilent(silentRequest)
      if (response?.accessToken) {
        return response.accessToken
      }
    } catch (error) {
      logger.warn(error)
    }
  }
}
