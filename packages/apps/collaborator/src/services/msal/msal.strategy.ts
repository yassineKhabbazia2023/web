import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { CurrentUserManager } from '@pulse/common/managers'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserService } from '@pulse/common/services/current-user'
import type { LogoutStrategy } from '@pulse/common/services/logout'
import type { SsoLoginStrategy } from '@pulse/common/services/login'
import type { TokenProviderStrategy } from '@pulse/common/services/token-provider'
import { tokenIsValid, useUserStore } from '@pulse/common/stores'

import { MsalService } from './msal.service'

export class MsalLoginStrategy implements SsoLoginStrategy {
  async redirect(): Promise<void> {
    await MsalService.loginRedirect()
  }

  async handleRedirectResult(): Promise<boolean> {
    const msalToken = await MsalService.getMSALToken()
    CurrentUserManager.persistToken(msalToken ?? '')

    if (isNullOrEmpty(msalToken)) {
      return false
    }

    try {
      const currentUser = await CurrentUserService.getCurrentUser()
      const userStore = useUserStore()
      userStore.setUser(currentUser)

      const userId = userStore.getUserId()
      if (userId === undefined || userId <= 0) {
        throw new Error('MsalLoginStrategy: invalid user id from getCurrentUser')
      }

      AmplitudeService.identifyCollaborator()
      AmplitudeService.setUserId(userId.toString())
      AmplitudeService.setUserEmail(userStore.getUserEmail())
      AmplitudeService.track('Sign In Completed', {
        sign_in_method: 'SSO',
        sign_in_result: 'succeeded',
      })

      return true
    } catch (error) {
      // Roll back token and user store so we never leave the user in a
      // partially-authenticated state. Idempotent: no-op if nothing was
      // persisted in the first place. Collab SSO only tracks success, so we
      // deliberately do not emit a "failed" amplitude event here.
      CurrentUserManager.clearUser()
      logger.error(error)
      return false
    }
  }
}

export class MsalLogoutStrategy implements LogoutStrategy {
  async cleanup(): Promise<void> {
    await MsalService.logout()
  }
}

export class MsalTokenStrategy implements TokenProviderStrategy {
  async refreshToken(): Promise<string> {
    logger.info('Refreshing MSAL token silently')
    const newToken = await MsalService.getFreshMSALToken()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from MSAL refresh')
  }
}
