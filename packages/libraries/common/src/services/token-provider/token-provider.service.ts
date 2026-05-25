import { isNotNullNorEmpty, isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import type { TokenProviderStrategy } from './token-provider.service.types'
import { useTokenStore } from '../../stores/token/token.store'

export class TokenProviderService {
  private static strategy: TokenProviderStrategy | undefined
  private static refreshPromise?: Promise<string>

  static registerProviderStrategy(strategy: TokenProviderStrategy): void {
    TokenProviderService.strategy = strategy
  }

  static async refreshToken(): Promise<string> {
    if (TokenProviderService.refreshPromise) {
      return TokenProviderService.refreshPromise
    }

    if (TokenProviderService.strategy === undefined) {
      throw new Error('TokenProviderService: no strategy registered')
    }

    TokenProviderService.refreshPromise = TokenProviderService.runRefresh(TokenProviderService.strategy)

    try {
      return await TokenProviderService.refreshPromise
    } finally {
      TokenProviderService.refreshPromise = undefined
    }
  }

  // Persists the refreshed token to the store BEFORE refreshPromise is cleared,
  // so concurrent callers that arrive after the clear cannot observe a stale
  // token in the store and trigger a duplicate refresh.
  private static async runRefresh(strategy: TokenProviderStrategy): Promise<string> {
    const token = await strategy.refreshToken()
    if (isNotNullNorEmpty(token) === false) {
      throw new Error('TokenProviderService: strategy returned an empty token')
    }
    const tokenStore = useTokenStore()
    // If the store has been cleared while we were refreshing (logout, 401
    // callback, etc.), reject so concurrent callers (e.g. the request
    // interceptor) do not attach the fresh token to post-logout requests.
    if (isNullOrEmpty(tokenStore.getToken())) {
      throw new Error('TokenProviderService: token store was cleared during refresh')
    }
    tokenStore.setToken(token)
    return token
  }

  static getRefreshPromise(): Promise<string> | undefined {
    return TokenProviderService.refreshPromise
  }
}
