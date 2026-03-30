import { logger } from '@pulse/toolbox'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import type { InternalAxiosRequestConfig } from 'axios'

/**
 * Interceptor to add Azure AD authentication token in request headers
 * @param config - Axios request configuration
 * @returns Modified request configuration with authorization header
 */
export const requestTokenInterceptor = async (config: InternalAxiosRequestConfig) => {
  try {
    const accessToken = await AdminMsalService.getMSALToken()

    if (accessToken !== null && accessToken !== undefined && accessToken !== '') {
      if (config.headers === undefined) {
        config.headers = {} as any
      }

      config.headers.Authorization = `Bearer ${accessToken}`
    } else {
      logger.warn('No access token available for this request')
    }
  } catch (error) {
    logger.error('Failed to retrieve access token:', error)
  }

  return config
}
