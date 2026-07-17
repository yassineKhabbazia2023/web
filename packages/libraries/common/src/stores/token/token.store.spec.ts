import { setActivePinia, createPinia } from 'pinia'
import { tokenMock, tokenExpMock } from '@common/__mocks__'
import { localStorageServiceMock } from '@common/__mocks__/vitest'

import { useTokenStore } from './token.store'

// No utils stub: tokenMock is a real JWT whose exp claim IS tokenExpMock, and
// the time-dependent tests pin "now" with fake timers, so this spec never
// depends on a mocked module instance (storage stays mocked by the setup).
describe('test tokenStore', () => {
  let tokenStore: ReturnType<typeof useTokenStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    tokenStore = useTokenStore()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function setNowInSeconds(seconds: number): void {
    vi.useFakeTimers()
    vi.setSystemTime(seconds * 1000)
  }

  describe('setToken', () => {
    it('should set token properly when setToken() is called', () => {
      tokenStore.setToken(tokenMock)

      expect(localStorageServiceMock.setToken).toHaveBeenCalledWith(tokenMock)
    })

    it('should reset when empty token is set', () => {
      tokenStore.setToken(tokenMock)

      tokenStore.setToken('')

      expect(localStorageServiceMock.setToken).toHaveBeenCalledWith('')
    })

    it('should not persist the token to storage when persistence is disabled', () => {
      tokenStore.setTokenPersistence(false)

      tokenStore.setToken(tokenMock)

      expect(localStorageServiceMock.setToken).not.toHaveBeenCalled()
      expect(tokenStore.getToken()).toBe(tokenMock)
    })
  })

  describe('getToken', () => {
    it('should return cached token when available', () => {
      tokenStore.setToken(tokenMock)

      const result = tokenStore.getToken()

      expect(result).toBe(tokenMock)
      expect(localStorageServiceMock.getToken).not.toHaveBeenCalled()
    })

    it('should get token from storage when cache is empty', () => {
      localStorageServiceMock.getToken.mockReturnValue(tokenMock)

      const result = tokenStore.getToken()

      expect(result).toBe(tokenMock)
      expect(localStorageServiceMock.getToken).toHaveBeenCalledOnce()
    })

    it('should return empty string when no token in storage', () => {
      localStorageServiceMock.getToken.mockReturnValue('')

      const result = tokenStore.getToken()

      expect(result).toBe('')
      expect(localStorageServiceMock.getToken).toHaveBeenCalledOnce()
    })

    it('should not read from storage when persistence is disabled and cache is empty', () => {
      tokenStore.setTokenPersistence(false)

      const result = tokenStore.getToken()

      expect(result).toBe('')
      expect(localStorageServiceMock.getToken).not.toHaveBeenCalled()
    })
  })

  describe('removeToken', () => {
    it('should remove token and reset state', () => {
      tokenStore.setToken(tokenMock)

      tokenStore.removeToken()

      expect(localStorageServiceMock.removeToken).toHaveBeenCalledOnce()
      expect(tokenStore.hasActiveToken()).toBe(false)
    })
  })

  describe('hasActiveToken', () => {
    it('should return false when no token exp', () => {
      const result = tokenStore.hasActiveToken()

      expect(result).toBe(false)
    })

    it('should return true when token is not expired', () => {
      tokenStore.setToken(tokenMock)
      setNowInSeconds(tokenExpMock - 100) // 100 seconds before expiry

      const result = tokenStore.hasActiveToken()

      expect(result).toBe(true)
    })

    it('should return false when token is expired', () => {
      tokenStore.setToken(tokenMock)
      setNowInSeconds(tokenExpMock + 100) // 100 seconds after expiry

      const result = tokenStore.hasActiveToken()

      expect(result).toBe(false)
    })
  })

  describe('timeUntilExpirationInMinutes', () => {
    it('should return 0 when no token exp', () => {
      const result = tokenStore.timeUntilExpirationInMinutes()

      expect(result).toBe(0)
    })

    it('should return remaining minutes when token is not expired', () => {
      tokenStore.setToken(tokenMock)
      setNowInSeconds(tokenExpMock - 300) // 5 minutes before expiry

      const result = tokenStore.timeUntilExpirationInMinutes()

      expect(result).toBe(5)
    })

    it('should return 0 when token is expired', () => {
      tokenStore.setToken(tokenMock)
      setNowInSeconds(tokenExpMock + 60) // 1 minute after expiry

      const result = tokenStore.timeUntilExpirationInMinutes()

      expect(result).toBe(0)
    })
  })

  describe('reset', () => {
    it('should reset token state', () => {
      tokenStore.setToken(tokenMock)

      tokenStore.reset()

      expect(tokenStore.hasActiveToken()).toBe(false)
    })
  })
})
