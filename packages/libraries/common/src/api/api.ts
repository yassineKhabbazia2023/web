import axios from 'axios'
import { VITE_API_GATEWAY } from 'env-vars'
import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import { responseInterceptorSuccess } from './interceptors/response-success.interceptor'
import { responseInterceptorError } from './interceptors/response-error.interceptor'

// Normalizes a domain into an axios baseURL: keeps `undefined` as-is (so axios
// falls back to relative URLs) and strips a single trailing slash otherwise.
export const domainToBaseUrl = (domain: string | undefined): string | undefined => {
  if (domain === undefined) {
    return undefined
  }

  if (domain.endsWith('/') === false) {
    return domain
  }

  return domain.slice(0, -1)
}

// Single factory for every axios instance of the monorepo. It centralizes the
// baseURL normalization, the JSON Content-Type and the shared request/response
// interceptors. Apps with their own auth flow (e.g. the MSAL-based backoffice)
// plug into the shared request interceptor by registering a token strategy on
// TokenProviderService, so no instance ever needs a custom interceptor.
export const createApiInstance = (domain: string | undefined) => {
  const instance = axios.create({
    baseURL: domainToBaseUrl(domain),
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use(requestTokenInterceptor)
  instance.interceptors.response.use(responseInterceptorSuccess, responseInterceptorError)

  return instance
}

let gatewayInstance: ReturnType<typeof createApiInstance> | undefined

export const api = {
  get gateway() {
    gatewayInstance ??= createApiInstance(VITE_API_GATEWAY)

    return gatewayInstance
  },
}
