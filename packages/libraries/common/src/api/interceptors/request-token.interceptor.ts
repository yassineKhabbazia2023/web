import { VITE_TOKEN_EXPIRATION_BUFFER } from 'env-vars'
import { logger } from '@pulse/core'
import { useTokenStore } from '../../stores/token/token.store'
import { TokenRefreshService } from '../../services/token-refresh.service'
import { CurrentUserManager } from '../../managers/current-user/current-user.manager'

const EXPIRATION_BUFFER = VITE_TOKEN_EXPIRATION_BUFFER || 5 // minutes

function tokenIsAboutToExpire() {
  const tokenStore = useTokenStore()
  const timeUntilExpirationInMinutes = tokenStore.timeUntilExpirationInMinutes()
  return timeUntilExpirationInMinutes < EXPIRATION_BUFFER
}

function updateTokenInConfig(config: any, token: string) {
  const tokenStore = useTokenStore()
  tokenStore.setToken(token)
  CurrentUserManager.persistToken(token)

  if (config.headers === undefined) {
    config.headers = {}
  }

  config.headers.Authorization = `Bearer ${token}`
}

export const requestTokenInterceptor = async (config: any) => {
  const tokenStore = useTokenStore()
  const token = tokenStore.getToken()

  // if we don't have an active token, the 401 interceptor will do its job
  // anyway, we can't refresh without a valid token
  if (tokenStore.hasActiveToken() === false) {
    return config
  }

  if (config.headers === undefined) {
    config.headers = {}
  }

  // Add existing token first
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Bypass if skipTokenRefresh is set
  if (config.skipTokenRefresh) {
    return config
  }

  // If refresh is already in progress, wait for it and use the new token
  // That way we don't let call bypass the token refresh and go through with an expired token
  // That may result in longer loading if the refresh Gigya or MSAL takes too long
  // But it's better than 401 and automatic logout
  const existingRefreshPromise = TokenRefreshService.getRefreshPromise()
  if (existingRefreshPromise) {
    try {
      logger.info('Token refresh in progress, waiting for completion')
      const newToken = await existingRefreshPromise
      updateTokenInConfig(config, newToken)
      logger.info('Used refreshed token from concurrent request')
    } catch (error) {
      logger.warn('Concurrent token refresh failed, continuing with current token', error)
    }
    return config
  }

  if (tokenIsAboutToExpire() === true) {
    try {
      logger.info('Token expiring soon, refreshing silently')
      const newToken = await TokenRefreshService.refreshToken()
      updateTokenInConfig(config, newToken)
      logger.info('Token refreshed successfully')
    } catch (error) {
      logger.warn('Silent token refresh failed, continuing with current token', error)
      // Continue with current token, 401 error will be handled by response-error.interceptor
    }
  }

  return config
}
