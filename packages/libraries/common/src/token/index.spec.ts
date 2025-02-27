import { describe, expect, it, vi, type MockInstance } from 'vitest'
import { TokenService } from '.'

const now = new Date()
const mockedExp = now.setHours(now.getHours() + 1) / 1000
const mockedSub = 'mocked-sub'

const mockedJwtDecode = vi.hoisted(() => vi.fn())
vi.mock('jwt-decode', () => ({
  default: mockedJwtDecode,
}))

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

describe('test token', () => {
  let tokenService: TokenService
  beforeEach(() => {
    mockedJwtDecode.mockReturnValue({
      exp: mockedExp,
      sub: mockedSub,
    })
    tokenService = TokenService.getInstance()
  })

  describe('getToken', () => {
    const localStoredToken = 'local-stored-token'
    let localStorageGetItemSpy: MockInstance
    beforeEach(() => {
      localStorageGetItemSpy = vi.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
    })

    it('return localStored value and call registerOnChange if token is not set in state', () => {
      localStorageGetItemSpy.mockReturnValueOnce(localStoredToken)

      const onChange = vi.fn()
      tokenService.registerOnChange('changeToken', onChange)
      const token = tokenService.getToken()
      expect(token).toBe(localStoredToken)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith('token')
      expect(onChange).toHaveBeenCalledWith(localStoredToken)
    })

    it('should return empty string if token is not initialized', () => {
      localStorageGetItemSpy.mockReturnValueOnce(null)
      tokenService.setToken('')

      const token = tokenService.getToken()
      expect(localStorageGetItemSpy).toHaveBeenCalledWith('token')
      expect(token).toBe('')
    })
  })

  describe('setToken', () => {
    const newTokenValue = 'new-token-value'
    let localStorageSetItemSpy: MockInstance
    beforeEach(() => {
      localStorageSetItemSpy = vi.spyOn(Object.getPrototypeOf(localStorage), 'setItem')
    })
    it('should set token value', () => {
      tokenService.setToken(newTokenValue)
      const tokenAfter = tokenService.getToken()

      expect(tokenAfter).toBe(newTokenValue)
    })
    it('should write token value in localstorage', () => {
      tokenService.setToken(newTokenValue)
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('token', newTokenValue)
    })
  })

  describe('hasValidAccessToken', () => {
    it("should 'hasValidAccessToken' return true with proper exp and sub if token is set", () => {
      const mockedToken = 'mocked-token'
      tokenService.setToken(mockedToken)
      const isValidToken = tokenService.hasValidAccessToken()

      expect(isValidToken).toBeTruthy()
      expect(tokenService.getTokenExp()).toBe(mockedExp)
      expect(tokenService.getTokenSub()).toBe(mockedSub)
    })

    it("should 'hasValidAccessToken' return false if token is empty", () => {
      tokenService.setToken('')
      const isValidToken = tokenService.hasValidAccessToken()

      expect(isValidToken).toBeFalsy()
      expect(tokenService.getTokenExp()).toBeUndefined()
      expect(tokenService.getTokenSub()).toBeUndefined()
    })

    it('should call logger when jwtDecode throws an error', () => {
      const mockedToken1 = 'mocked-token-1'
      const mockedToken2 = 'mocked-token-2'
      const mockedError = new Error('jwt-decode-failed')
      mockedJwtDecode
        .mockReturnValueOnce({
          exp: mockedExp,
          sub: mockedSub,
        })
        .mockImplementationOnce(() => {
          throw mockedError
        })
      tokenService.setToken(mockedToken1)
      tokenService.setToken(mockedToken2)

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(mockedError)
      expect(tokenService.getTokenExp()).toBeUndefined()
      expect(tokenService.getTokenSub()).toBeUndefined()
    })
  })

  describe('registeredCallbacks', () => {
    const tokenValue = 'token-value'
    const newTokenValue = 'new-token-value'
    it('should call registered callbacks on register and should not call them when unregistering', () => {
      const callbackSpy = vi.fn().mockImplementation((token: string) => token)
      tokenService.registerOnChange('cb', callbackSpy)
      tokenService.setToken(tokenValue)
      tokenService.unregisterOnChange('cb')
      tokenService.setToken(newTokenValue)
      expect(callbackSpy).toHaveBeenCalledOnce()
      expect(callbackSpy).toHaveBeenNthCalledWith(1, tokenValue)
    })
  })
})
