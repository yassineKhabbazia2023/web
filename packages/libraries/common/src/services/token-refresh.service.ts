import { logger } from '@pulse/toolbox'
import { refreshClientToken } from './authentication.service'
import { MsalService } from './msal'
import { useUserStore } from '../stores/user/user.store'
import { tokenIsValid } from '../stores/token/token.store.utils'

export class TokenRefreshService {
  private static refreshPromise?: Promise<string>

  static async refreshToken(): Promise<string> {
    // If already in progress, return existing promise
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performRefresh()

    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = undefined
    }
  }

  private static async performRefresh(): Promise<string> {
    const userStore = useUserStore()

    if (userStore.isCollab) {
      return await this.refreshMsalToken()
    } else {
      return await this.refreshGigyaToken()
    }
  }

  private static async refreshGigyaToken(): Promise<string> {
    logger.info('Refreshing Gigya token silently')
    const newToken = await refreshClientToken()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from Gigya refresh')
  }

  private static async refreshMsalToken(): Promise<string> {
    logger.info('Refreshing MSAL token silently')
    const newToken = await MsalService.getFreshMSALToken()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from MSAL refresh')
  }

  static getRefreshPromise(): Promise<string> | undefined {
    return this.refreshPromise
  }
}
