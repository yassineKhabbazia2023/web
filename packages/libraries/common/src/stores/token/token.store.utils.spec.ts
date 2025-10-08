import { tokenMock, tokenExpMock } from '@common/__mocks__'
import { getTokenExp, tokenIsValid, nowInSeconds } from './token.store.utils'

vi.mock('@pulse/toolbox')
const jwtDecodeMock = vi.hoisted(() => vi.fn())
vi.mock('jwt-decode', () => ({
  jwtDecode: jwtDecodeMock,
}))

describe('token.store.utils', () => {
  beforeEach(() => {
    jwtDecodeMock.mockReturnValue({
      exp: tokenExpMock,
    })
  })

  describe('getTokenExp', () => {
    it('should return exp value when token is valid', () => {
      const exp = getTokenExp(tokenMock)

      expect(exp).toBe(tokenExpMock)
      expect(jwtDecodeMock).toHaveBeenCalledWith(tokenMock)
    })

    it('should return 0 when token is empty', () => {
      jwtDecodeMock.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const exp = getTokenExp('')

      expect(exp).toBe(0)
      expect(jwtDecodeMock).toHaveBeenCalledWith('')
    })

    it('should return 0 when jwt-decode throws error', () => {
      jwtDecodeMock.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const exp = getTokenExp('invalid-token')

      expect(exp).toBe(0)
      expect(jwtDecodeMock).toHaveBeenCalledWith('invalid-token')
    })

    it('should return undefined when token has no exp claim', () => {
      jwtDecodeMock.mockReturnValue({})

      const exp = getTokenExp(tokenMock)

      expect(exp).toBeUndefined()
    })
  })

  describe('tokenIsValid', () => {
    const futureTimestamp = nowInSeconds() + 3600 // 1 hour from now
    const pastTimestamp = nowInSeconds() - 3600 // 1 hour ago

    it('should return true when token is valid and not expired', () => {
      jwtDecodeMock.mockReturnValue({
        exp: futureTimestamp,
      })

      const isValid = tokenIsValid(tokenMock)

      expect(isValid).toBe(true)
    })

    it('should return false when token is expired', () => {
      jwtDecodeMock.mockReturnValue({
        exp: pastTimestamp,
      })

      const isValid = tokenIsValid(tokenMock)

      expect(isValid).toBe(false)
    })

    it('should return false when token has no exp claim', () => {
      jwtDecodeMock.mockReturnValue({})

      const isValid = tokenIsValid(tokenMock)

      expect(isValid).toBe(false)
    })

    it('should return false when token is invalid', () => {
      jwtDecodeMock.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const isValid = tokenIsValid('invalid-token')

      expect(isValid).toBe(false)
    })

    it('should return false when token is empty', () => {
      const isValid = tokenIsValid('')

      expect(isValid).toBe(false)
      expect(jwtDecodeMock).not.toHaveBeenCalled()
    })

    it('should return false when exp is 0', () => {
      jwtDecodeMock.mockReturnValue({
        exp: 0,
      })

      const isValid = tokenIsValid(tokenMock)

      expect(isValid).toBe(false)
    })

    it('should return false when exp equals current time', () => {
      const currentTimestamp = nowInSeconds()

      jwtDecodeMock.mockReturnValue({
        exp: currentTimestamp,
      })

      const isValid = tokenIsValid(tokenMock)

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
