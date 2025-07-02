import { logger } from '@pulse/core'
import { VITE_API_MSAL_SCOPE,
  VITE_API_MSAL_CLIENT_ID,
  VITE_API_MSAL_TENANT,
  VITE_API_MSAL_AUTHORITY,
  VITE_API_MSAL_REDIRECT_URI,
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
} from 'env-vars'

import { AuthenticationParameters, UserAgentApplication } from 'msal'

const msalConfig = {
  auth: {
    clientId: VITE_API_MSAL_CLIENT_ID,
    tenant: VITE_API_MSAL_TENANT,
    authority: VITE_API_MSAL_AUTHORITY,
    redirectUri: VITE_API_MSAL_REDIRECT_URI,
    postLogoutRedirectUri: VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
    response_mode: 'query',
  },
}

export class MsalService {
  private static instance: UserAgentApplication

  private constructor() {
    // Private constructor to prevent instantiation
  }

  private static getInstance() {
    MsalService.instance ??= new UserAgentApplication(msalConfig)
    return MsalService.instance
  }

  static getAccount() {
    return MsalService.getInstance().getAccount()
  }

  static loginRedirect(userRequest?: AuthenticationParameters) {
    return MsalService.getInstance().loginRedirect(userRequest)
  }

  static logout(correlationId?: string) {
    return MsalService.getInstance().logout(correlationId)
  }

  static async acquireTokenSilent(userRequest: AuthenticationParameters) {
    return MsalService.getInstance().acquireTokenSilent(userRequest)
  }

  static async getMSALToken() {
    const msalAccount = MsalService.getAccount()
    if (msalAccount) {
      const userRequest: AuthenticationParameters = {
        loginHint: msalAccount.userName,
        scopes: [VITE_API_MSAL_SCOPE],
      }
      return await MsalService.acquireTokenSilent(userRequest)
        .then((response: any) => {
          const token = response.accessToken
          return token
        })
        .catch((error) => {
          logger.warn(error)
          // we (temporarily?) don't track the sign in failure
          // we want to see if MsalService reduce the Amplitude billing
          // amplitudeService.track('Sign In Completed', {
          // sign_in_method: 'SSO',
          // sign_in_result: 'failed',
          // })
          MsalService.loginRedirect()
        })
    }
    return null
  }
}
