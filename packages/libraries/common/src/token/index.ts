import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
interface RegisteredCallback {
  key: string
  callback: (_token: string) => void
}

export const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token)
  return !!exp && exp * 1000 < Date.now()
}

export class TokenService {

  private static instance: TokenService
  private token: string = ''
  private registeredCallbacks: RegisteredCallback[] = []


  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }

    return TokenService.instance
  }

  getToken(): string {
    if (!this.token) {
      const token = localStorage.getItem('token') ?? ''
      if (token) {
        this.token = token
        this.onChange(token)
      }
    }

    return this.token
  }

  setToken(token: string) {
    this.token = token
    if (token) {
      localStorage.setItem('token', token)
    } else {
      this.removeToken()
    }
    this.onChange(token)
  }

  removeToken() {
    localStorage.removeItem('token')
  }

  hasValidAccessToken(): boolean {
    return !!this.getToken() && !isTokenExpired(this.token)
  }

  registerOnChange(key: string, callback: RegisteredCallback['callback']) {
    this.registeredCallbacks.push({
      key,
      callback,
    })
  }

  unregisterOnChange(key: string) {
    const index = this.registeredCallbacks.findIndex(({ key: _key }) => key === _key)

    if (index >= 0) {
      this.registeredCallbacks.splice(index, 1)
    }
  }

  onChange(token: string) {
    this.registeredCallbacks.forEach(({ callback }) => callback(token))
  }
}
