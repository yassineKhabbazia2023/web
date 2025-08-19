import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginManager } from './login.manager'
import { MsalService } from '@admin-tools/services/msal.service'

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(),
  AccountInfo: {},
}))

vi.mock('@admin-tools/services/msal.service')

const mockedMsalService = vi.mocked(MsalService)

describe('LoginManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initAuthSSO', () => {
    it('should handle redirect result and call login redirect', async () => {
      mockedMsalService.handleRedirectResult.mockResolvedValue(true)
      mockedMsalService.loginRedirect.mockResolvedValue()

      await LoginManager.initAuthSSO()

      expect(mockedMsalService.handleRedirectResult).toHaveBeenCalledOnce()
      expect(mockedMsalService.loginRedirect).toHaveBeenCalledOnce()
      expect(mockedMsalService.loginRedirect).toHaveBeenCalledWith()
    })

    it('should handle errors from handleRedirectResult', async () => {
      const error = new Error('Redirect handling failed')
      mockedMsalService.handleRedirectResult.mockRejectedValue(error)

      await expect(LoginManager.initAuthSSO()).rejects.toThrow('Redirect handling failed')
      expect(mockedMsalService.handleRedirectResult).toHaveBeenCalledOnce()
      expect(mockedMsalService.loginRedirect).not.toHaveBeenCalled()
    })
  })

  describe('handleLogout', () => {
    it('should call MsalService logout method', async () => {
      mockedMsalService.logout.mockResolvedValue()

      await LoginManager.handleLogout()

      expect(mockedMsalService.logout).toHaveBeenCalledOnce()
      expect(mockedMsalService.logout).toHaveBeenCalledWith()
    })
  })
})

