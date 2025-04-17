import { useTokenStore } from '../../stores/token/token.store'

export const requestTokenInterceptor = (config: any) => {
  const tokenStore = useTokenStore()
  const token = tokenStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}