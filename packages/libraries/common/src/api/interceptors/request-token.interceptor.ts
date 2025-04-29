import { TokenManager } from '../../managers/token/token.manager'

export const requestTokenInterceptor = (config: any) => {
  const token = TokenManager.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}