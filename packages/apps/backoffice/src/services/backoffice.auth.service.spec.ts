import { BackofficeAuthService } from './backoffice.auth.service'
import { CurrentUserManager } from '@pulse/common/managers'
import { TokenRefreshService } from '@pulse/common/services/token-refresh'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    initToken: vi.fn(),
  },
}))

vi.mock('@pulse/common/services/token-refresh', () => ({
  TokenRefreshService: {
    registerRefreshStrategy: vi.fn(),
  },
}))

vi.mock('@backoffice/services/admin-msal/admin-msal.service')

describe('BackofficeAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('init', () => {
    it('should call CurrentUserManager.initToken', () => {
      BackofficeAuthService.init()

      expect(CurrentUserManager.initToken).toHaveBeenCalledExactlyOnceWith()
    })

    it('should register a token refresh strategy', () => {
      BackofficeAuthService.init()

      expect(TokenRefreshService.registerRefreshStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(Function))
    })
  })

  describe('token refresh strategy', () => {
    it('should return a fresh Admin MSAL token', async () => {
      vi.mocked(AdminMsalService.getFreshMSALToken).mockResolvedValue('fresh-admin-token')

      BackofficeAuthService.init()

      const strategy = vi.mocked(TokenRefreshService.registerRefreshStrategy).mock.calls[0][0]
      const token = await strategy()

      expect(AdminMsalService.getFreshMSALToken).toHaveBeenCalledExactlyOnceWith()
      expect(token).toBe('fresh-admin-token')
    })

    it('should throw when AdminMsalService returns null', async () => {
      vi.mocked(AdminMsalService.getFreshMSALToken).mockResolvedValue(null)

      BackofficeAuthService.init()

      const strategy = vi.mocked(TokenRefreshService.registerRefreshStrategy).mock.calls[0][0]

      await expect(strategy()).rejects.toThrow('Failed to refresh Admin MSAL token')
    })
  })
})
