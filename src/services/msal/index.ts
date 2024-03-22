import {
  VITE_API_MSAL_CLIENT_ID,
  VITE_API_MSAL_TENANT,
  VITE_API_MSAL_AUTHORITY,
  VITE_API_MSAL_REDIRECT_URI,
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
  VITE_API_MSAL_SCOPE,
} from 'env-vars'
import { tokenService } from '@kpmg/common'
import { UserAgentApplication } from 'msal'

const msalConfig = {
  auth: {
    clientId: VITE_API_MSAL_CLIENT_ID,
    tenant: VITE_API_MSAL_TENANT,
    authority: VITE_API_MSAL_AUTHORITY,
    redirectUri: VITE_API_MSAL_REDIRECT_URI,
    postLogoutRedirectUri: VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
  },
}
export const msalInstance = new UserAgentApplication(msalConfig)

export const getToken = async () => {
  if (msalInstance.getAccount()) {
    return await msalInstance
      .acquireTokenSilent({
        loginHint: msalInstance.getAccount().userName,
        scopes: [VITE_API_MSAL_SCOPE],
      })
      .then((response: any) => {
        const token = response.accessToken
        tokenService.setToken(token)
        return token
      })
      .catch((e) => {
        console.warn(e)
        msalInstance.loginRedirect()
      })
  }
  return null
}

export const getRefreshToken = () => {
  if (msalInstance.getAccount()) {
    msalInstance.acquireTokenPopup({
      loginHint: msalInstance.getAccount().userName,
      scopes: [VITE_API_MSAL_SCOPE],
    })
  } else {
    msalInstance.loginRedirect()
  }
}
