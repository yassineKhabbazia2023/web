import { logger } from '@pulse/core'
import jwtDecode from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'

export const LOCAL_STORAGE_TOKEN_KEY = 'token'

export class TokenManager {
  static setToken(token: string) {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)
  }

  static getToken(): string {
    return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || ''
  }

  static removeToken() {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
  }

  static hasActiveToken(): boolean {
    const token = TokenManager.getToken()
    if (token === '') {
      return false
    }

    try {
      const { exp } = jwtDecode<JwtPayload>(token)

      if (exp === undefined) {
        return false
      }

      return Date.now() < exp * 1000
    } catch (error) {
      logger.error('Failed to decode token', error)
      return false
    }
  }
}
