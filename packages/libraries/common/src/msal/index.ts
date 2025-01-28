import {
  VITE_API_MSAL_CLIENT_ID,
  VITE_API_MSAL_TENANT,
  VITE_API_MSAL_AUTHORITY,
  VITE_API_MSAL_REDIRECT_URI,
  VITE_API_MSAL_POST_LOGOUT_REDIRECT_URI,
} from 'env-vars'
import { UserAgentApplication } from 'msal'

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

export const msalInstance = new UserAgentApplication(msalConfig)
