import { TokenManager, LOCAL_STORAGE_TOKEN_KEY } from './token.manager'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

vi.mock('@pulse/core')

// Helper function to create JWT tokens for testing
function createTestToken(payload: Record<string, any> = {}): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  return `${encodedHeader}.${encodedPayload}.signature`
}

describe('TokenManager', () => {
  describe('setToken', () => {
    it('should store token in localStorage', () => {
      const token = 'test-token'

      TokenManager.setToken(token)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_TOKEN_KEY, token)
    })
  })

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const token = 'test-token'
      localStorageMock.getItem.mockReturnValue(token)

      const result = TokenManager.getToken()

      expect(localStorageMock.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_TOKEN_KEY)
      expect(result).toBe(token)
    })

    it('should return empty string when no token in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(undefined)

      const result = TokenManager.getToken()

      expect(result).toBe('')
    })
  })

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      TokenManager.removeToken()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(LOCAL_STORAGE_TOKEN_KEY)
    })
  })

  describe('hasActiveToken', () => {
    it('should return false when no token exists', () => {
      localStorageMock.getItem.mockReturnValue('')

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(false)
    })

    it('should return false when token is undefined', () => {
      localStorageMock.getItem.mockReturnValue(undefined)

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(false)
    })

    it('should return true when token is valid and not expired', () => {
      // Token expires in 1 hour from now
      const futureExp = Math.floor(Date.now() / 1000) + 3600
      const validToken = createTestToken({ exp: futureExp })
      localStorageMock.getItem.mockReturnValue(validToken)

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(true)
    })

    it('should return false when token is expired', () => {
      // Token expired 1 hour ago
      const pastExp = Math.floor(Date.now() / 1000) - 3600
      const expiredToken = createTestToken({ exp: pastExp })
      localStorageMock.getItem.mockReturnValue(expiredToken)

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(false)
    })

    it('should return false when token has no exp field', () => {
      const tokenWithoutExp = createTestToken({ sub: 'user' })
      localStorageMock.getItem.mockReturnValue(tokenWithoutExp)

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(false)
    })

    it('should return false when token is malformed', () => {
      const malformedToken = 'invalid.token.here'
      localStorageMock.getItem.mockReturnValue(malformedToken)

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(false)
    })

    it('should return false when token is completely invalid', () => {
      const invalidToken = 'not-a-jwt-token'
      localStorageMock.getItem.mockReturnValue(invalidToken)

      const result = TokenManager.hasActiveToken()

      expect(result).toBe(false)
    })
  })
})
