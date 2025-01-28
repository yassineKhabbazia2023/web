import { logger } from '@pulse/core'
import { VITE_API_MSAL_SCOPE } from 'env-vars'
import { amplitudeService, tokenService, msalInstance } from '@pulse/common'

export const getToken = async () => {
  if (msalInstance.getAccount()) {
    amplitudeService.setNewUserProperty('user_type', 'Collaborateur')
    return await msalInstance
      .acquireTokenSilent({
        loginHint: msalInstance.getAccount().userName,
        scopes: [VITE_API_MSAL_SCOPE],
      })
      .then((response: any) => {
        const token = response.accessToken
        tokenService.setToken(token)
        amplitudeService.track('Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'succeeded',
        })
        return token
      })
      .catch((e) => {
        logger.warn(e)
        amplitudeService.track('Sign In Completed', {
          sign_in_method: 'SSO',
          sign_in_result: 'failed',
        })
        msalInstance.loginRedirect()
      })
  }
  return null
}
