export const getTokenMock = vi.fn(() => 'abcdef-123456')
export const setTokenMock = vi.fn()
export const hasValidAccessTokenMock = vi.fn(() => true)

export const isTokenExpiredMock = vi.fn(() => false)

export const tokenServiceMock = {
  isTokenExpired: isTokenExpiredMock,
  TokenService: {
    getInstance: () => ({
      getToken: getTokenMock,
      setToken: setTokenMock,
      hasValidAccessToken: hasValidAccessTokenMock,
    }),
  },
}
