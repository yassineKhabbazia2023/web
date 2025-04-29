import { CurrentUserManager, SelectedEntityManager, TokenManager } from '@pulse/common/managers'
import { resetAllStores } from '@pulse/common/stores'
import { APP_ROUTES } from '@pulse/common/constants'
import { amplitudeService } from '@pulse/common'
import { VITE_AMPLITUDE_API_KEY, VITE_AMPLITUDE_SERVER_URL } from 'env-vars'
import { logger } from '@pulse/core'

export class BootManager {
  static getDefaultRedirection() {
    if(CurrentUserManager.isAuthenticated()) {
      return BootManager.getDefaultAuthenticatedRoute()
    } else {
      return BootManager.getDefaultAnonymousRoute()
    }
  }

  static getDefaultAnonymousRoute() {
    return { name: APP_ROUTES.anonymous.name }
  }

  static getDefaultAuthenticatedRoute() {
    return { name: APP_ROUTES.authenticated.name }
  }

  static initAmplitude() {
    try {
      const amplitudeApiKey = VITE_AMPLITUDE_API_KEY
      const amplitudeServerUrl = VITE_AMPLITUDE_SERVER_URL

      if (amplitudeApiKey) {
        amplitudeService.init(amplitudeApiKey, amplitudeServerUrl || undefined)
      }
    } catch (error) {
      logger.error('Amplitude initialization failed:', error)
      // do not throw, we don't want to crash the app if amplitude fails
    }
  }

  static clearAppState() {
    // clean stores
    resetAllStores()
  }

  static clearAppStorage() {
    // clean localstorage
    TokenManager.removeToken()
    SelectedEntityManager.clearSelectedEntity()
  }
}