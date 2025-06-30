import { logger } from '@pulse/core'
import { VITE_API_MSAL_SCOPE } from 'env-vars'
import { msalInstance } from '@pulse/common'

export const getMSALToken = async () => {
  if (msalInstance.getAccount()) {
    return await msalInstance
      .acquireTokenSilent({
        loginHint: msalInstance.getAccount().userName,
        scopes: [VITE_API_MSAL_SCOPE],
      })
      .then((response: any) => {
        const token = response.accessToken
        return token
      })
      .catch((e) => {
        logger.warn(e)
        // we (temporarily?) don't track the sign in failure
        // we want to see if this reduce the Amplitude billing
        // amplitudeService.track('Sign In Completed', {
        // sign_in_method: 'SSO',
        // sign_in_result: 'failed',
        // })
        msalInstance.loginRedirect()
      })
  }
  return null
}
