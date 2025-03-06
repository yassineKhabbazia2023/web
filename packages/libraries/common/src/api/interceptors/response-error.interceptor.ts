import { HTTP_ERRORS } from '../../constants.mjs'
import { getUnauthorizedCallback } from '../../unauthorized-callback'
import { AxiosError } from 'axios'

export const responseInterceptorError = (err: AxiosError) => {
  if (err?.status === HTTP_ERRORS.UNAUTHORIZED) {
    const unauthorizedCallback = getUnauthorizedCallback()

    unauthorizedCallback?.()
  }
  return Promise.reject(err)
}