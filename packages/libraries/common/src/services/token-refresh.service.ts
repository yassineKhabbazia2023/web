import { logger } from '@pulse/toolbox'
import { tokenIsValid } from '../stores/token/token.store.utils'

type RefreshStrategy = () => Promise<string>

export class TokenRefreshService {
  private static refreshPromise?: Promise<string>
  private static refreshStrategy?: RefreshStrategy

  static registerRefreshStrategy(strategy: RefreshStrategy): void {
    this.refreshStrategy = strategy
  }

  static resetRefreshStrategy(): void {
    this.refreshStrategy = undefined
  }

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
    if (this.refreshStrategy === undefined) {
      throw new Error('No token refresh strategy registered. Call TokenRefreshService.registerRefreshStrategy() at app startup.')
    }

    logger.info('Refreshing token silently')
    const newToken = await this.refreshStrategy()

    if (tokenIsValid(newToken)) {
      return newToken
    }

    throw new Error('Invalid token received from refresh strategy')
  }

  static getRefreshPromise(): Promise<string> | undefined {
    return this.refreshPromise
  }
}
