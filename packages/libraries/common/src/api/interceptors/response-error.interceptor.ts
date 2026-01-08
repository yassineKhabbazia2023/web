import { HTTP_RESPONSES, SKIP_CALLBACK_CODES } from '../../constants'
import { getUnauthorizedCallback } from '../../unauthorized-callback'
import { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../api.types'

export const responseInterceptorError = (err: AxiosError<ApiErrorResponse>) => {
  if (err?.status === HTTP_RESPONSES.UNAUTHORIZED) {
    const errorCode = err?.response?.data?.errorCode
    // Don't trigger logout for specific error codes
    const shouldCallbackBeSkipped = !!(errorCode && SKIP_CALLBACK_CODES.includes(errorCode))

    if (shouldCallbackBeSkipped === false) {
      const unauthorizedCallback = getUnauthorizedCallback()
      unauthorizedCallback?.()
    }
  }
  return Promise.reject(err)
}
