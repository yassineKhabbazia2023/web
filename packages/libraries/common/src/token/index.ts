import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { logger } from '@pulse/core'

interface RegisteredCallback {
  key: string
  callback: (_token: string) => void
}

export const isTokenExpired = (tokenExp: number|undefined): boolean => {
  const nowInSeconds = Date.now() / 1000

  return (tokenExp ?? 0) < nowInSeconds
}

export class TokenService {

  private static instance: TokenService
  private token: string = ''
  private tokenExp: number|undefined = undefined
  private tokenSub: string|undefined = undefined
  private registeredCallbacks: RegisteredCallback[] = []

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }

    return TokenService.instance
  }

  getToken(): string {
    return this.token
  }

  initToken() {
    const token = localStorage.getItem('token') ?? ''
    if (token) {
      this.token = token
      this.onChange(token)
    }
  }

  getTokenExp() {
    return this.tokenExp
  }

  getTokenSub() {
    return this.tokenSub
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
    return !isTokenExpired(this.tokenExp)
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

  private onChange(token: string) {
    try {
      const { exp, sub } = token ? jwtDecode<JwtPayload>(token) : {
        exp: undefined,
        sub: undefined,
      }

      this.tokenExp = exp
      this.tokenSub = sub
    } catch(error) {
      this.tokenExp = undefined
      this.tokenSub = undefined

      logger.error(error)
    }

    this.registeredCallbacks.forEach(({ callback }) => callback(token))
  }
}
