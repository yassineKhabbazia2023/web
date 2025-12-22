import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'

import { SessionStorageService } from './session-storage.service'
import { SsoProvider } from './session-storage.service.enums'
import type { SamlSsoContext } from './session-storage.service.types'

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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // #region Generic storage methods tests

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

  // #endregion

  // #region SAML SSO Context tests (Pennylane SSO redirect)

  describe('SAML SSO context methods', () => {
    const mockContext: SamlSsoContext = {
      spName: SsoProvider.PENNYLANE,
      samlContext: 'test-saml-context',
      mode: 'login',
    }

    it('should set SAML SSO context in sessionStorage with spName in key', () => {
      SessionStorageService.setSamlSsoContext(mockContext)

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'saml-sso-context-pennylane',
        JSON.stringify(mockContext),
      )
    })

    it('should get SAML SSO context from sessionStorage by spName', () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify(mockContext))

      const result = SessionStorageService.getSamlSsoContext(SsoProvider.PENNYLANE)

      expect(sessionStorageMock.getItem).toHaveBeenCalledWith('saml-sso-context-pennylane')
      expect(result).toEqual(mockContext)
    })

    it('should return undefined when no SSO context exists', () => {
      sessionStorageMock.getItem.mockReturnValue(null)

      const result = SessionStorageService.getSamlSsoContext(SsoProvider.PENNYLANE)

      expect(result).toBeUndefined()
    })

    it('should return undefined for invalid JSON', () => {
      sessionStorageMock.getItem.mockReturnValue('invalid-json')

      const result = SessionStorageService.getSamlSsoContext(SsoProvider.PENNYLANE)

      expect(result).toBeUndefined()
    })

    it('should remove SAML SSO context from sessionStorage by spName', () => {
      SessionStorageService.removeSamlSsoContext(SsoProvider.PENNYLANE)

      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('saml-sso-context-pennylane')
    })

    it('should return true when SSO context exists for spName', () => {
      sessionStorageMock.getItem.mockReturnValue(JSON.stringify(mockContext))

      expect(SessionStorageService.hasSamlSsoContext(SsoProvider.PENNYLANE)).toBe(true)
    })

    it('should return false when SSO context does not exist for spName', () => {
      sessionStorageMock.getItem.mockReturnValue(null)

      expect(SessionStorageService.hasSamlSsoContext(SsoProvider.PENNYLANE)).toBe(false)
    })

    it('should store different contexts for different providers', () => {
      const otherContext: SamlSsoContext = {
        spName: 'other-provider' as SsoProvider,
        samlContext: 'other-context',
        mode: 'login',
      }

      SessionStorageService.setSamlSsoContext(mockContext)
      SessionStorageService.setSamlSsoContext(otherContext)

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'saml-sso-context-pennylane',
        JSON.stringify(mockContext),
      )
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'saml-sso-context-other-provider',
        JSON.stringify(otherContext),
      )
    })

    describe('consumeSamlSsoContext', () => {
      it('should return context and remove it from sessionStorage', () => {
        sessionStorageMock.getItem.mockReturnValue(JSON.stringify(mockContext))

        const result = SessionStorageService.consumeSamlSsoContext(SsoProvider.PENNYLANE)

        expect(result).toEqual(mockContext)
        expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('saml-sso-context-pennylane')
      })

      it('should return undefined and not call removeItem when no context exists', () => {
        sessionStorageMock.getItem.mockReturnValue(null)

        const result = SessionStorageService.consumeSamlSsoContext(SsoProvider.PENNYLANE)

        expect(result).toBeUndefined()
        expect(sessionStorageMock.removeItem).not.toHaveBeenCalled()
      })
    })
  })

  // #endregion

  // #region Redirect context tests

  describe('Redirect context methods', () => {
    describe('setRedirectContext', () => {
      it('should save redirect context in sessionStorage', () => {
        const fullPath = '/dossier/12?mode=notification'

        SessionStorageService.setRedirectContext(fullPath)

        expect(sessionStorageMock.setItem).toHaveBeenCalledWith('pulse-redirect-context', fullPath)
      })

      it('should not save empty path', () => {
        SessionStorageService.setRedirectContext('')

        expect(sessionStorageMock.setItem).not.toHaveBeenCalled()
      })

      it('should not save path that does not start with /', () => {
        SessionStorageService.setRedirectContext('invalid-path')

        expect(sessionStorageMock.setItem).not.toHaveBeenCalled()
      })
    })

    describe('consumeRedirectContext', () => {
      it('should return redirect context from sessionStorage', () => {
        const fullPath = '/dossier/12?mode=notification'
        sessionStorageMock.getItem.mockReturnValue(fullPath)

        const result = SessionStorageService.consumeRedirectContext()

        expect(sessionStorageMock.getItem).toHaveBeenCalledWith('pulse-redirect-context')
        expect(result).toBe(fullPath)
      })

      it('should remove redirect context after reading', () => {
        sessionStorageMock.getItem.mockReturnValue('/some/path')

        SessionStorageService.consumeRedirectContext()

        expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('pulse-redirect-context')
      })

      it('should return undefined when no context exists', () => {
        sessionStorageMock.getItem.mockReturnValue(null)

        const result = SessionStorageService.consumeRedirectContext()

        expect(result).toBeUndefined()
      })

      it('should not call removeItem when no context exists', () => {
        sessionStorageMock.getItem.mockReturnValue(null)

        SessionStorageService.consumeRedirectContext()

        expect(sessionStorageMock.removeItem).not.toHaveBeenCalled()
      })
    })
  })

  // #endregion
})
