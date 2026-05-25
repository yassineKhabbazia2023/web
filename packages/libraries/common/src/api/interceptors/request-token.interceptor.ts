import { VITE_TOKEN_EXPIRATION_BUFFER } from 'env-vars'
import { logger } from '@pulse/toolbox'
import { isNullOrEmpty } from '@pulse/toolbox/utils/validator'
import { useTokenStore } from '../../stores/token/token.store'
import { TokenProviderService } from '../../services/token-provider/token-provider.service'

const EXPIRATION_BUFFER = VITE_TOKEN_EXPIRATION_BUFFER || 5 // minutes

function tokenIsAboutToExpire() {
  const tokenStore = useTokenStore()
  const timeUntilExpirationInMinutes = tokenStore.timeUntilExpirationInMinutes()
  return timeUntilExpirationInMinutes < EXPIRATION_BUFFER
}

function setAuthorizationHeader(config: any, token: string) {
  if (config.headers === undefined) {
    config.headers = {}
  }
  config.headers.Authorization = `Bearer ${token}`
}

export const requestTokenInterceptor = async (config: any) => {
  const tokenStore = useTokenStore()
  const token = tokenStore.getToken()

  // No token at all: unauthenticated request, let it through.
  // The 401 response interceptor will handle protected endpoints.
  if (isNullOrEmpty(token)) {
    return config
  }

  setAuthorizationHeader(config, token)

  // Bypass if skipTokenRefresh is set
  if (config.skipTokenRefresh) {
    return config
  }

  // If refresh is already in progress, wait for it and use the new token
  // That way we don't let call bypass the token refresh and go through with an expired token
  // That may result in longer loading if the registered token provider takes too long
  // But it's better than 401 and automatic logout
  const existingRefreshPromise = TokenProviderService.getRefreshPromise()
  if (existingRefreshPromise) {
    try {
      logger.info('Token refresh in progress, waiting for completion')
      const newToken = await existingRefreshPromise
      setAuthorizationHeader(config, newToken)
      logger.info('Used refreshed token from concurrent request')
    } catch (error) {
      logger.warn('Concurrent token refresh failed, continuing with current token', error)
    }
    return config
  }

  // Refresh when expired OR about to expire. The registered strategies
  // (Gigya/MSAL) rely on external SDK state (cookie, SSO session), not on
  // the local JWT, so they can refresh an already-expired token.
  if (tokenStore.hasActiveToken() === false || tokenIsAboutToExpire() === true) {
    try {
      logger.info('Token expired or expiring soon, refreshing silently')
      const newToken = await TokenProviderService.refreshToken()
      setAuthorizationHeader(config, newToken)
      logger.info('Token refreshed successfully')
    } catch (error) {
      logger.warn('Silent token refresh failed, continuing with current token', error)
      // Continue with current token, 401 error will be handled by response-error.interceptor
    }
  }

  return config
}
