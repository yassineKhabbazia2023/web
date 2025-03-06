import { TokenService } from '../../token'

export const requestTokenInterceptor = (config: any) => {
  const token = TokenService.getInstance().getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}