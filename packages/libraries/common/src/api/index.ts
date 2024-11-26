import axios, { type AxiosInstance } from 'axios'
import * as envVars from 'env-vars'
import { tokenService } from '../main.mts'

const varApiPrefix = 'VITE_API_'

type apiInstances = Record<string, AxiosInstance>

const keyToService = (key: string) => key.replace(varApiPrefix, '').toLowerCase()

const domainToBaseUrl = (domain: string | undefined) => {
  if (domain && domain.endsWith('/')) {
    return domain.slice(0, -1)
  } else {
    return domain
  }
}

export const requestInterceptor = (config: any) => {
  const token = tokenService.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

export const responseInterceptorSuccess = (res: any) => res
export const responseInterceptorError = (err: Error) => {
  return Promise.reject(err)
}

export default () => {
  return Object.keys(envVars).reduce(
    (apis: apiInstances, k) => {
      if (k.startsWith(varApiPrefix)) {
        const service = keyToService(k)
        const baseURL = domainToBaseUrl(envVars[k])
        const instance = axios.create({
          baseURL,
          headers: { 'Content-type': 'application/json' },
        })
        instance.interceptors.request.use(requestInterceptor)
        instance.interceptors.response.use(
          responseInterceptorSuccess,
          responseInterceptorError,
        )
        apis[service] = instance
      }
      return apis
    },
    {},
  )
}
