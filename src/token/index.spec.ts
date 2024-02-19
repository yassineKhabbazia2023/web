import { describe, expect, it, vi, type SpyInstance } from 'vitest'
import { TokenService } from '.'

describe('test token', () => {
  let tokenService: TokenService
  beforeEach(() => {
    tokenService = new TokenService()
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
    it('should call callback when token changes', () => {
      const callbackSpy = vi.fn().mockImplementation((token: string) => token)
      tokenService.registerOnChange('cb', callbackSpy)
      tokenService.setToken(newTokenValue)
      expect(callbackSpy).toHaveBeenNthCalledWith(1, newTokenValue)
    })
  })

  describe('unregisterOnChange', () => {
    it('should remove registred callback when call unregisterOnChange', () => {
      const callbackSpy = vi.fn().mockImplementation((token: string) => token)
      expect(tokenService.registeredCallBack).toHaveLength(0)
      tokenService.registerOnChange('cb', callbackSpy)
      expect(tokenService.registeredCallBack).toHaveLength(1)
      tokenService.unregisterOnChange('cb')
      expect(tokenService.registeredCallBack).toHaveLength(0)
    })
  })
})
