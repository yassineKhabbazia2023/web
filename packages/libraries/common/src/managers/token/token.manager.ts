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
}
