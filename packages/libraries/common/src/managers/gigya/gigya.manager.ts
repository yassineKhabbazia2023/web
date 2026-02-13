import { logger } from '@pulse/toolbox'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { FeatureFlagManager } from '../feature-flag/feature-flag.manager'
import './gigya.type'

export class GigyaManager {
  static setStoreGigyaUserId(gigyaUserId: string) {
    const tokenStore = useTokenStore()
    const token = tokenStore.getToken()

    if (token) {
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
}
