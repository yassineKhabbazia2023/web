import { useTokenStore, tokenIsValid } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { LoginManager } from './login.manager'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'

const tokenStoreMock = getStoreMock(useTokenStore)

describe('LoginManager', () => {
  describe('initAuthSSO', () => {
    it('should handle redirect result and call login redirect', async () => {
      const handleRedirectResultSpy = vi.spyOn(AdminMsalService, 'handleRedirectResult').mockResolvedValue(true)
      const loginRedirectSpy = vi.spyOn(AdminMsalService, 'loginRedirect').mockResolvedValue()

      await LoginManager.initAuthSSO()

      expect(handleRedirectResultSpy).toHaveBeenCalledExactlyOnceWith()
      expect(loginRedirectSpy).toHaveBeenCalledExactlyOnceWith()
    })

    it('should handle errors from handleRedirectResult', async () => {
      const error = new Error('Redirect handling failed')
      const handleRedirectResultSpy = vi.spyOn(AdminMsalService, 'handleRedirectResult').mockRejectedValue(error)
      const loginRedirectSpy = vi.spyOn(AdminMsalService, 'loginRedirect').mockResolvedValue()

      await expect(LoginManager.initAuthSSO()).rejects.toThrow('Redirect handling failed')
      expect(handleRedirectResultSpy).toHaveBeenCalledExactlyOnceWith()
      expect(loginRedirectSpy).not.toHaveBeenCalled()
    })
  })

  describe('syncToken', () => {
    it('should seed the token store when MSAL returns a valid token', async () => {
      const getMSALTokenSpy = vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue('valid-token')
      vi.mocked(tokenIsValid).mockReturnValue(true)

      await LoginManager.syncToken()

      expect(getMSALTokenSpy).toHaveBeenCalledExactlyOnceWith()
      expect(tokenStoreMock.setToken).toHaveBeenCalledExactlyOnceWith('valid-token')
      expect(tokenStoreMock.removeToken).not.toHaveBeenCalled()
    })

    it('should clear the token store when MSAL returns no valid token', async () => {
      vi.spyOn(AdminMsalService, 'getMSALToken').mockResolvedValue(null)
      vi.mocked(tokenIsValid).mockReturnValue(false)

      await LoginManager.syncToken()

      expect(tokenStoreMock.setToken).not.toHaveBeenCalled()
      expect(tokenStoreMock.removeToken).toHaveBeenCalledExactlyOnceWith()
    })
  })

  describe('handleLogout', () => {
    it('should clear the token store and call MsalService logout method', async () => {
      const logoutSpy = vi.spyOn(AdminMsalService, 'logout').mockResolvedValue()

      await LoginManager.handleLogout()

      expect(tokenStoreMock.removeToken).toHaveBeenCalledExactlyOnceWith()
      expect(logoutSpy).toHaveBeenCalledExactlyOnceWith()
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
