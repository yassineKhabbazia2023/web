import jwtDecode, { JwtPayload } from 'jwt-decode'
interface RegisteredCallback {
  key: string,
  callback: (_token: string) => void
}

export const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token)
  return !!exp && exp * 1000 < Date.now()
}

export class TokenService {
  // eslint-disable-next-line no-use-before-define
  private static instance: TokenService
  private token: string = ''
  private registeredCallbacks: RegisteredCallback[] = []

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService()
    }

    return TokenService.instance
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('token') ?? ''
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
      callback
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
