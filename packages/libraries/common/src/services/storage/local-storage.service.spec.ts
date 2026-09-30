import { loggerErrorSpy } from '@pulse/toolbox/mocks'

import { LocalStorageService } from './local-storage.service'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

describe('LocalStorageService', () => {
  // Stub the worker-shared localStorage per test (restored automatically by
  // unstubGlobals) instead of overwriting the global at module scope, which
  // would leak to other files of the worker (doctrine: shared-dom).
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock)
  })

  describe('Token methods', () => {
    it('should set token in localStorage', () => {
      const token = 'test-token'

      LocalStorageService.setToken(token)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', token)
    })

    it('should get token from localStorage', () => {
      const token = 'test-token'
      localStorageMock.getItem.mockReturnValue(token)

      const result = LocalStorageService.getToken()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(result).toBe(token)
    })

    it('should return empty string when no token', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = LocalStorageService.getToken()

      expect(result).toBe('')
    })

    it('should remove token from localStorage', () => {
      LocalStorageService.removeToken()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
    })
  })


  describe('Error handling', () => {

    it('should handle setItem errors gracefully', async () => {
      const error = new Error('setItem failed')
      localStorageMock.setItem.mockImplementation(() => {
        throw error
      })

      LocalStorageService.setToken('large-token')

      expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to set item in localStorage: token', error)
    })

    it('should handle localStorage.getItem errors gracefully', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('getItem failed')
      })

      const result = LocalStorageService.getToken()

      expect(result).toBe('')
      expect(loggerErrorSpy).toHaveBeenCalled()
    })

    it('should handle localStorage.removeItem errors gracefully', async () => {
      const removeError = new Error('removeItem failed')
      localStorageMock.removeItem.mockImplementation(() => {
        throw removeError
      })

      LocalStorageService.removeToken()

      expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to remove item from localStorage: token', removeError)
    })
  })
})
