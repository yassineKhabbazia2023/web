import axios from 'axios'
import { VITE_API_GATEWAY, VITE_API_DS, VITE_API_SCHEDULE } from 'env-vars'
import { tokenService } from '../main.mts'

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

const createAxiosInstance = (domain: string) => {
  const instance = axios.create({
    baseURL: domainToBaseUrl(domain),
    headers: { 'Content-type': 'application/json' },
  })

  instance.interceptors.request.use(requestInterceptor)
  instance.interceptors.response.use(
    responseInterceptorSuccess,
    responseInterceptorError,
  )

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
