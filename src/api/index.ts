import commonStore from '../stores'
import axios, { type AxiosInstance } from 'axios'
import { storeToRefs } from 'pinia'
import * as envVars from 'env-vars'

const varApiPrefix = 'VITE_API_'

type apiInstances = Record<string, AxiosInstance>

const keyToService = (key: string) => key.replace(varApiPrefix, '').toLowerCase()

const domainToBaseUrl = (domain: string | undefined) => {
  if (domain && domain.endsWith('/')) return domain.slice(0, -1)
  else return domain
}

const requestInterceptor = (config: any) => {
  const { user } = storeToRefs(commonStore())
  if (user.value && user.value.token) config.headers.Authorization = `Bearer ${user.value.token}`
  return config
}

const responseInterceptorSuccess = (res: any) => res
const responseInterceptorError = (err: any) => {
  return Promise.reject(err)
}

export default () => {
  return Object.keys(envVars).reduce(
    (apis: apiInstances, k) => {
      if (k.startsWith(varApiPrefix)) {
        const service = keyToService(k)
        const baseURL = domainToBaseUrl(process.env[k])
        const instance = axios.create({
          baseURL,
          headers: { 'Content-type': 'application/json' }
        })
        instance.interceptors.request.use(requestInterceptor)
        instance.interceptors.response.use(
          responseInterceptorSuccess,
          responseInterceptorError
        )
        apis[service] = instance
      }
      return apis
    },
    {}
  )
}
