import { describe, expect, it, vi, type SpyInstance } from 'vitest'
import { TokenService } from '.'

const now = new Date()
vi.mock('jwt-decode', () => ({
  default: () => ({
    exp: now.setHours(now.getHours() + 1),
  }),
}))

describe('test token', () => {
  let tokenService: TokenService
  beforeEach(() => {
    tokenService = TokenService.getInstance()
  })

  describe('getToken', () => {
    const localStoredToken = 'local-stored-token'
    let localStorageGetItemSpy: SpyInstance
    beforeEach(() => {
      localStorageGetItemSpy = vi.spyOn(Object.getPrototypeOf(localStorage), 'getItem')
    })
    it('return localStored value if token is not set in state', () => {
      localStorageGetItemSpy.mockReturnValueOnce(localStoredToken)

      const token = tokenService.getToken()
      expect(token).toBe(localStoredToken)
      expect(localStorageGetItemSpy).toHaveBeenCalledWith('token')
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
    let localStorageSetItemSpy: SpyInstance
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
    it("should 'hasValidAccessToken' return true if token is set", () => {
      tokenService.setToken('token')
      const isValidToken = tokenService.hasValidAccessToken()

      expect(isValidToken).toBeTruthy()
    })
    it("should 'hasValidAccessToken' return false if token is empty", () => {
      tokenService.setToken('')
      const isValidToken = tokenService.hasValidAccessToken()

      expect(isValidToken).toBeFalsy()
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
