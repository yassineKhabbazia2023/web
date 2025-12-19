import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'

import { SessionStorageService } from './session-storage.service'

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

describe('SessionStorageService', () => {
  describe('getItem', () => {
    it('should return value from sessionStorage', () => {
      const key = 'test-key'
      const value = 'test-value'
      sessionStorageMock.getItem.mockReturnValue(value)

      const result = SessionStorageService['getItem'](key)

      expect(sessionStorageMock.getItem).toHaveBeenCalledWith(key)
      expect(result).toBe(value)
    })

    it('should return undefined when sessionStorage returns null', () => {
      sessionStorageMock.getItem.mockReturnValue(null)

      const result = SessionStorageService['getItem']('non-existent-key')

      expect(result).toBeUndefined()
    })

    it('should handle getItem errors gracefully and return undefined', () => {
      const error = new Error('getItem failed')
      sessionStorageMock.getItem.mockImplementation(() => {
        throw error
      })

      const result = SessionStorageService['getItem']('key')

      expect(result).toBeUndefined()
      expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to get item from sessionStorage: key', error)
    })
  })

  describe('setItem', () => {
    it('should set value in sessionStorage', () => {
      const key = 'test-key'
      const value = 'test-value'

      SessionStorageService['setItem'](key, value)

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(key, value)
    })

    it('should handle setItem errors gracefully', () => {
      const error = new Error('setItem failed')
      sessionStorageMock.setItem.mockImplementation(() => {
        throw error
      })

      SessionStorageService['setItem']('key', 'value')

      expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to set item in sessionStorage: key', error)
    })
  })

  describe('removeItem', () => {
    it('should remove item from sessionStorage', () => {
      const key = 'test-key'

      SessionStorageService['removeItem'](key)

      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith(key)
    })

    it('should handle removeItem errors gracefully', () => {
      const error = new Error('removeItem failed')
      sessionStorageMock.removeItem.mockImplementation(() => {
        throw error
      })

      SessionStorageService['removeItem']('key')

      expect(loggerErrorSpy).toHaveBeenCalledWith('Failed to remove item from sessionStorage: key', error)
    })
  })
})
