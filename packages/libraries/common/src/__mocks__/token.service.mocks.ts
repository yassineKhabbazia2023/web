export const getTokenExpMock = vi.fn(() => 123456)
export const getTokenMock = vi.fn(() => 'abcdef-123456')
export const getTokenSubMock = vi.fn(() => 'mocked-sub')
export const hasValidAccessTokenMock = vi.fn(() => true)
export const initTokenMock = vi.fn()
export const isTokenExpiredMock = vi.fn(() => false)
export const registerOnChangeMock = vi.fn()
export const setTokenMock = vi.fn()
export const unregisterOnChangeMock = vi.fn()

export const tokenServiceMock = {
  isTokenExpired: isTokenExpiredMock,
  TokenService: {
    getInstance: () => ({
      getToken: getTokenMock,
      getTokenExp: getTokenExpMock,
      getTokenSub: getTokenSubMock,
      hasValidAccessToken: hasValidAccessTokenMock,
      initToken: initTokenMock,
      registerOnChange: registerOnChangeMock,
      setToken: setTokenMock,
      unregisterOnChange: unregisterOnChangeMock,
    }),
  },
}
