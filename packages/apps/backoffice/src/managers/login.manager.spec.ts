import { loggerMock } from '@pulse/toolbox/mocks'
import { useTokenStore, tokenIsValid } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { LoginManager } from './login.manager'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(),
  AccountInfo: {},
}))

vi.mock('@backoffice/services/admin-msal/admin-msal.service')

// Keep the real token store (so getStoreMock can auto-mock its actions under the
// testing pinia) but stub tokenIsValid to control validity in the syncToken tests.
vi.mock('@pulse/common/stores', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pulse/common/stores')>()),
  tokenIsValid: vi.fn(),
}))

const tokenStoreMock = getStoreMock(useTokenStore)
const mockedMsalService = vi.mocked(AdminMsalService)

describe('LoginManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  describe('initAuthSSO', () => {
    it('should handle redirect result and call login redirect', async () => {
      mockedMsalService.handleRedirectResult.mockResolvedValue(true)
      mockedMsalService.loginRedirect.mockResolvedValue()

      await LoginManager.initAuthSSO()

      expect(mockedMsalService.handleRedirectResult).toHaveBeenCalledExactlyOnceWith()
      expect(mockedMsalService.loginRedirect).toHaveBeenCalledExactlyOnceWith()
    })

    it('should handle errors from handleRedirectResult', async () => {
      const error = new Error('Redirect handling failed')
      mockedMsalService.handleRedirectResult.mockRejectedValue(error)

      await expect(LoginManager.initAuthSSO()).rejects.toThrow('Redirect handling failed')
      expect(mockedMsalService.handleRedirectResult).toHaveBeenCalledExactlyOnceWith()
      expect(mockedMsalService.loginRedirect).not.toHaveBeenCalled()
    })
  })

  describe('syncToken', () => {
    it('should seed the token store when MSAL returns a valid token', async () => {
      mockedMsalService.getMSALToken.mockResolvedValue('valid-token')
      vi.mocked(tokenIsValid).mockReturnValue(true)

      await LoginManager.syncToken()

      expect(mockedMsalService.getMSALToken).toHaveBeenCalledExactlyOnceWith()
      expect(tokenStoreMock.setToken).toHaveBeenCalledExactlyOnceWith('valid-token')
      expect(tokenStoreMock.removeToken).not.toHaveBeenCalled()
    })

    it('should clear the token store when MSAL returns no valid token', async () => {
      mockedMsalService.getMSALToken.mockResolvedValue(null)
      vi.mocked(tokenIsValid).mockReturnValue(false)

      await LoginManager.syncToken()

      expect(tokenStoreMock.setToken).not.toHaveBeenCalled()
      expect(tokenStoreMock.removeToken).toHaveBeenCalledExactlyOnceWith()
    })
  })

  describe('handleLogout', () => {
    it('should clear the token store and call MsalService logout method', async () => {
      mockedMsalService.logout.mockResolvedValue()

      await LoginManager.handleLogout()

      expect(tokenStoreMock.removeToken).toHaveBeenCalledExactlyOnceWith()
      expect(mockedMsalService.logout).toHaveBeenCalledExactlyOnceWith()
    })
  })

  describe('clearAuthStorage', () => {
    it('should clear all localStorage', () => {
      const clearMock = vi.fn()

      vi.stubGlobal('localStorage', {
        clear: clearMock,
      })

      LoginManager.clearAuthStorage()

      expect(clearMock).toHaveBeenCalledExactlyOnceWith()
      expect(tokenStoreMock.removeToken).toHaveBeenCalledExactlyOnceWith()

      vi.unstubAllGlobals()
    })

    it('should handle errors when clearing localStorage', () => {
      const clearMock = vi.fn(() => {
        throw new Error('Clear failed')
      })

      vi.stubGlobal('localStorage', {
        clear: clearMock,
      })

      // Should not throw, just log the error
      expect(() => LoginManager.clearAuthStorage()).not.toThrow()
      expect(clearMock).toHaveBeenCalledExactlyOnceWith()

      vi.unstubAllGlobals()
    })
  })
})

