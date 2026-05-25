import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { CurrentUserManager } from '@pulse/common/managers'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { login, refreshClientToken } from '@pulse/common/services/authentication'
import { CurrentUserService } from '@pulse/common/services/current-user'
import type { LoginStrategy } from '@pulse/common/services/login'
import type { LogoutStrategy } from '@pulse/common/services/logout'
import type { TokenProviderStrategy } from '@pulse/common/services/token-provider'
import { tokenIsValid, useUserStore } from '@pulse/common/stores'

import { GigyaManager } from './gigya.manager'

export class GigyaLoginStrategy implements LoginStrategy {
  async authenticate(email: string, password: string): Promise<void> {
    const { webToken, userId: gigyaUserId } = await login({ email, password })
    const trimmedToken = webToken?.trim() ?? ''

    if (isNotNullNorEmpty(trimmedToken) === false) {
      throw new Error('No token received')
    }

    CurrentUserManager.persistToken(trimmedToken)

    try {
      const currentUser = await CurrentUserService.getCurrentUser()
      const userStore = useUserStore()
      userStore.setUser(currentUser)

      const customerId = userStore.getUserId()
      if (customerId === undefined || customerId <= 0) {
        throw new Error('GigyaLoginStrategy: invalid user id from getCurrentUser')
      }
      AmplitudeService.identifyCustomer()
      AmplitudeService.setUserId(customerId.toString())
      AmplitudeService.setUserEmail(userStore.getUserEmail())
      AmplitudeService.track('Sign In Completed', {
        sign_in_method: 'email',
        sign_in_result: 'succeeded',
      })

      GigyaManager.setStoreGigyaUserId(gigyaUserId)
      GigyaManager.loginSSO(email, password)
    } catch (error) {
      // Roll back token and user store so we never leave the user in a
      // partially-authenticated state. The caller sees the original error.
      CurrentUserManager.clearUser()
      throw error
    }
  }
}

export class GigyaLogoutStrategy implements LogoutStrategy {
  // `async` matches the LogoutStrategy contract for symmetry with
  // MsalLogoutStrategy. Gigya's `accounts.logout()` is synchronous
  // (fire-and-forget via the SDK), so there is nothing to await here.
  async cleanup(): Promise<void> {
    GigyaManager.logoutSSO()
  }
}

export class GigyaTokenStrategy implements TokenProviderStrategy {
  async refreshToken(): Promise<string> {
    logger.info('Refreshing Gigya token silently')
    const newToken = await refreshClientToken()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from Gigya refresh')
  }
}
