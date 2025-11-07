import { loggerMock } from '@pulse/toolbox/mocks'
import { LoginManager } from './login.manager'
import { AdminMsalService } from '@admin-tools/services/admin-msal/admin-msal.service'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(),
  AccountInfo: {},
}))

vi.mock('@admin-tools/services/admin-msal/admin-msal.service')

const mockedMsalService = vi.mocked(AdminMsalService)

describe('LoginManager', () => {
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

  describe('handleLogout', () => {
    it('should call MsalService logout method', async () => {
      mockedMsalService.logout.mockResolvedValue()

      await LoginManager.handleLogout()

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

