import { CurrentUserManager, CurrentEntityManager, FeatureFlagManager } from '@pulse/common/managers'
import { resetAllStores, useTokenStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { VITE_AMPLITUDE_API_KEY, VITE_AMPLITUDE_SERVER_URL } from 'env-vars'
import { logger } from '@pulse/toolbox'

export class CustomerBootManager {

  static checkMaintenanceMode() {
    if (FeatureFlagManager.isMaintenanceModeActivated()) {
      logger.info('Maintenance mode is activated')
      return true
    }
    return false
  }

  static getDefaultRedirection() {
    if (CurrentUserManager.isAuthenticated()) {
      return CustomerBootManager.getDefaultAuthenticatedRoute()
    } else {
      return CustomerBootManager.getDefaultAnonymousRoute()
    }
  }

  static getDefaultAnonymousRoute() {
    return { name: RouteName.ANONYMOUS }
  }

  static getDefaultAuthenticatedRoute() {
    return { name: RouteName.AUTHENTICATED }
  }

  static initAmplitude() {
    try {
      const amplitudeApiKey = VITE_AMPLITUDE_API_KEY
      const amplitudeServerUrl = VITE_AMPLITUDE_SERVER_URL

      if (amplitudeApiKey && FeatureFlagManager.isAmplitudeActivated()) {
        AmplitudeService.init(amplitudeApiKey, amplitudeServerUrl)
      }
    } catch (error) {
      logger.error('Amplitude initialization failed:', error)
      // do not throw, we don't want to crash the app if amplitude fails
    }
  }

  static clearAppState() {
    // clear stores
    resetAllStores()
  }

  static clearAppStorage() {
    // clear user data
    const tokenStore = useTokenStore()
    tokenStore.removeToken()
    CurrentEntityManager.clearCurrentEntity()
  }
}
