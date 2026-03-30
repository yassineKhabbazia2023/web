import axios from 'axios'
import { VITE_API_BASE_URL, VITE_API_GATEWAY } from 'env-vars'
import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import { responseInterceptorSuccess } from './interceptors/response-success.interceptor'
import { responseInterceptorError } from './interceptors/response-error.interceptor'

const domainToBaseUrl = (domain: string) => {
  if (domain?.endsWith('/')) {
    return domain.slice(0, -1)
  } else {
    return domain
  }
}

const createBaseAxiosInstance = (domain: string) => {
  const instance = axios.create({
    baseURL: domainToBaseUrl(domain),
    headers: { 'Content-type': 'application/json' },
  })

  return instance
}

const createAppAxiosInstance = (domain: string) => {
  const instance = createBaseAxiosInstance(domain)

  instance.interceptors.request.use(requestTokenInterceptor)
  instance.interceptors.response.use(responseInterceptorSuccess, responseInterceptorError)

  return instance
}

export const api = {
  gateway: createAppAxiosInstance(VITE_API_GATEWAY),
  // Separate instance for backoffice calls — same config as gateway for now,
  // but kept distinct to allow independent interceptors in the future.
  backofficeGateway: createAppAxiosInstance(VITE_API_GATEWAY),
  backofficeApi: createAppAxiosInstance(VITE_API_BASE_URL),
}
