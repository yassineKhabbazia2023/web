import axios from 'axios'
import { VITE_API_GATEWAY, VITE_API_DS, VITE_API_SCHEDULE } from 'env-vars'
import { requestTokenInterceptor } from './interceptors/request-token.interceptor'
import { responseInterceptorSuccess } from './interceptors/response-success.interceptor'
import { responseInterceptorError } from './interceptors/response-error.interceptor'

const domainToBaseUrl = (domain: string | undefined) => {
  if (domain && domain.endsWith('/')) {
    return domain.slice(0, -1)
  } else {
    return domain
  }
}

const createAxiosInstance = (domain: string) => {
  const instance = axios.create({
    baseURL: domainToBaseUrl(domain),
    headers: { 'Content-type': 'application/json' },
  })

  instance.interceptors.request.use(requestTokenInterceptor)
  instance.interceptors.response.use(responseInterceptorSuccess, responseInterceptorError)

  return instance
}

const api = {
  gateway: createAxiosInstance(VITE_API_GATEWAY),
  ds: createAxiosInstance(VITE_API_DS),
  schedule: createAxiosInstance(VITE_API_SCHEDULE), // DEPRECATED
}

export default () => {
  return api
}
