import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '@pulse/common/managers'
import './gigya.types'

export class GigyaManager {
  static setStoreGigyaUserId(gigyaUserId: string) {
    const tokenStore = useTokenStore()
    const token = tokenStore.getToken()

    if (isNotNullNorEmpty(token)) {
      const userStore = useUserStore()
      userStore.setGigyaUserId(gigyaUserId)
    }
  }

  static loginSSO(email: string, password: string) {
    if (FeatureFlagManager.isGigyaSsoActivated() === false) {
      return
    }

    try {
      globalThis.gigya.accounts.login({
        loginID: email,
        password,
      })
    } catch (error) {
      // Silent error: no need to block the user experience on gigya failure
      logger.error('Error during Gigya SSO login: ', error)
    }
  }

  static logoutSSO() {
    if (FeatureFlagManager.isGigyaSsoActivated() === false) {
      return
    }

    try {
      globalThis.gigya.accounts.logout()
    } catch (error) {
      logger.error('Error during Gigya SSO logout: ', error)
    }
  }
}
