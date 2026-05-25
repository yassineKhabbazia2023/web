import { HTTP_RESPONSES, SKIP_CALLBACK_CODES } from '../../constants'
import { getUnauthorizedCallback } from '../../unauthorized-callback'
import { AxiosError } from 'axios'
import type { ApiErrorResponse, CustomAxiosRequestConfig } from '../api.types'

export const responseInterceptorError = (err: AxiosError<ApiErrorResponse>) => {
  if (err?.status === HTTP_RESPONSES.UNAUTHORIZED) {
    const config = err.config as CustomAxiosRequestConfig | undefined
    // Skip when the request opts out (e.g. the logout endpoint itself, so a
    // 401 from /logout does not re-trigger another logout and recurse).
    const shouldSkipFromConfig = config?.skipUnauthorizedCallback === true

    const errorCode = err?.response?.data?.errorCode
    // Don't trigger logout for specific error codes
    const shouldSkipFromCode = !!(errorCode && SKIP_CALLBACK_CODES.includes(errorCode))

    if (shouldSkipFromConfig === false && shouldSkipFromCode === false) {
      const unauthorizedCallback = getUnauthorizedCallback()
      unauthorizedCallback?.()
    }
  }
  return Promise.reject(err)
}
