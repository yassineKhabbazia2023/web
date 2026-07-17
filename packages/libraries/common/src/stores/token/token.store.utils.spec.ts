import { loggerMock } from '@pulse/toolbox/mocks'
import { tokenMock, tokenExpMock } from '@common/__mocks__'
import { getTokenExp, tokenIsValid, nowInSeconds } from './token.store.utils'

// No jwt-decode mock: the tests decode real (unsigned) JWTs built on the fly,
// so this spec stays valid on the spy-wrapped module instance shared by the
// whole worker (see vitest.setup.ts).
function createTestToken(payload: Record<string, unknown> = {}): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  return `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.signature`
}

describe('token.store.utils', () => {
  describe('getTokenExp', () => {
    it('should return exp value when token is valid', () => {
      const exp = getTokenExp(tokenMock)

      expect(exp).toBe(tokenExpMock)
    })

    it('should return 0 when token is empty', () => {
      const exp = getTokenExp('')

      expect(exp).toBe(0)
    })

    it('should return 0 when the token cannot be decoded', () => {
      const exp = getTokenExp('invalid-token')

      expect(exp).toBe(0)
    })

    it('should return undefined when token has no exp claim', () => {
      const exp = getTokenExp(createTestToken())

      expect(exp).toBeUndefined()
    })
  })

  describe('tokenIsValid', () => {
    it('should return true when token is valid and not expired', () => {
      const isValid = tokenIsValid(createTestToken({ exp: nowInSeconds() + 3600 }))

      expect(isValid).toBe(true)
    })

    it('should return false when token is expired', () => {
      const isValid = tokenIsValid(createTestToken({ exp: nowInSeconds() - 3600 }))

      expect(isValid).toBe(false)
    })

    it('should return false when token has no exp claim', () => {
      const isValid = tokenIsValid(createTestToken())

      expect(isValid).toBe(false)
    })

    it('should return false when token is invalid', () => {
      const isValid = tokenIsValid('invalid-token')

      expect(isValid).toBe(false)
    })

    it('should return false when token is empty without attempting to decode', () => {
      const isValid = tokenIsValid('')

      expect(isValid).toBe(false)
      // The empty guard short-circuits before getTokenExp, so no decode is
      // attempted and no decode error is logged (contrast the invalid case).
      expect(loggerMock.error).not.toHaveBeenCalled()
    })

    it('should return false when exp is 0', () => {
      const isValid = tokenIsValid(createTestToken({ exp: 0 }))

      expect(isValid).toBe(false)
    })

    it('should return false when exp equals current time', () => {
      const isValid = tokenIsValid(createTestToken({ exp: nowInSeconds() }))

      expect(isValid).toBe(false)
    })

    it('should return false for undefined token', () => {
      const isValid = tokenIsValid(undefined)

      expect(isValid).toBe(false)
    })

    it('should return false for null token', () => {
      const isValid = tokenIsValid(null)

      expect(isValid).toBe(false)
    })

    it('should return false for non-string token', () => {
      const isValid = tokenIsValid(123)

      expect(isValid).toBe(false)
    })
  })
})
