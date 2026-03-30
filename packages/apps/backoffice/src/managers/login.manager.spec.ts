import { loggerMock } from '@pulse/toolbox/mocks'
import { LoginManager } from './login.manager'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { CurrentUserManager } from '@pulse/common/managers'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(),
  AccountInfo: {},
}))

vi.mock('@backoffice/services/admin-msal/admin-msal.service')
vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    persistToken: vi.fn(),
  },
}))

const mockedMsalService = vi.mocked(AdminMsalService)

describe('LoginManager', () => {
  describe('initAuthSSO', () => {
    it('should persist token and skip loginRedirect when already authenticated after redirect', async () => {
      mockedMsalService.handleRedirectResult.mockResolvedValue(true)
      mockedMsalService.getMSALToken.mockResolvedValue('msal-token')

      await LoginManager.initAuthSSO()

      expect(mockedMsalService.handleRedirectResult).toHaveBeenCalledExactlyOnceWith()
      expect(mockedMsalService.getMSALToken).toHaveBeenCalledExactlyOnceWith()
      expect(CurrentUserManager.persistToken).toHaveBeenCalledExactlyOnceWith('msal-token')
      expect(mockedMsalService.loginRedirect).not.toHaveBeenCalled()
    })

    it('should redirect to login when getMSALToken returns null', async () => {
      mockedMsalService.handleRedirectResult.mockResolvedValue(true)
      mockedMsalService.getMSALToken.mockResolvedValue(null)
      mockedMsalService.loginRedirect.mockResolvedValue()

      await LoginManager.initAuthSSO()

      expect(CurrentUserManager.persistToken).not.toHaveBeenCalled()
      expect(mockedMsalService.loginRedirect).toHaveBeenCalledExactlyOnceWith()
    })

    it('should call loginRedirect when not authenticated after redirect', async () => {
      mockedMsalService.handleRedirectResult.mockResolvedValue(false)
      mockedMsalService.loginRedirect.mockResolvedValue()

      await LoginManager.initAuthSSO()

      expect(mockedMsalService.handleRedirectResult).toHaveBeenCalledExactlyOnceWith()
      expect(CurrentUserManager.persistToken).not.toHaveBeenCalled()
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

