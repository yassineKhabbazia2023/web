interface RegisteredCallBack {
  key: string,
  callback: (_token: string) => void
}

export class TokenService {
  token = ''
  registeredCallBack: RegisteredCallBack[] = []

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
      localStorage.removeItem('token')
    }
    this.onChange(token)
  }

  registerOnChange(key: string, callback: RegisteredCallBack['callback']) {
    this.registeredCallBack.push({
      key,
      callback
    })
  }

  unregisterOnChange(key: string) {
    const index = this.registeredCallBack.findIndex(({ key: _key }) => key === _key)

    if (index >= 0) {
      this.registeredCallBack.splice(index, 1)
    }
  }

  onChange(token: string) {
    this.registeredCallBack.forEach(({ callback }) => callback(token))
  }
}
