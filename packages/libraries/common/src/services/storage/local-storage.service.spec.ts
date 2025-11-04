import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'

import { LocalStorageService } from './local-storage.service'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

describe('LocalStorageService', () => {
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

  describe('Last visited entity methods', () => {
    it('should set last visited entity ID', () => {
      const entityId = 123

      LocalStorageService.setLastVisitedEntityId(entityId)

      expect(localStorageMock.setItem).toHaveBeenCalledWith('last-visited-entity', '123')
    })

    it('should get last visited entity ID', () => {
      localStorageMock.getItem.mockReturnValue('456')

      const result = LocalStorageService.getLastVisitedEntityId()

      expect(localStorageMock.getItem).toHaveBeenCalledWith('last-visited-entity')
      expect(result).toBe(456)
    })

    it('should return undefined for invalid entity ID', () => {
      localStorageMock.getItem.mockReturnValue('invalid')

      const result = LocalStorageService.getLastVisitedEntityId()

      expect(result).toBeUndefined()
    })

    it('should return undefined when no entity ID', () => {
      localStorageMock.getItem.mockReturnValue(null)

      const result = LocalStorageService.getLastVisitedEntityId()

      expect(result).toBeUndefined()
    })

    it('should remove last visited entity ID', () => {
      LocalStorageService.removeLastVisitedEntityId()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('last-visited-entity')
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
