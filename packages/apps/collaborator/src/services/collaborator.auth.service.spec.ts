import { CollaboratorAuthService } from './collaborator.auth.service'
import { CurrentUserManager } from '@pulse/common/managers'
import { setUnauthorizedCallback } from '@pulse/common/unauthorized-callback'
import { TokenRefreshService } from '@pulse/common/services/token-refresh'
import { MsalService } from '@pulse/common/services/msal'
import { Layout, RouteName } from '@pulse/common/enums'
import type { Router } from 'vue-router'
import { computed } from 'vue'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    initToken: vi.fn(),
    persistToken: vi.fn(),
  },
}))

vi.mock('@pulse/common/unauthorized-callback', () => ({
  setUnauthorizedCallback: vi.fn(),
}))

vi.mock('@pulse/common/services/token-refresh', () => ({
  TokenRefreshService: {
    registerRefreshStrategy: vi.fn(),
  },
}))

vi.mock('@pulse/common/services/msal', () => ({
  MsalService: {
    getFreshMSALToken: vi.fn(),
  },
}))

describe('CollaboratorAuthService', () => {
  const mockRouter = {
    replace: vi.fn(),
  } as unknown as Router

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('init', () => {
    it('should call CurrentUserManager.initToken', () => {
      const currentLayout = computed(() => Layout.MAIN)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      expect(CurrentUserManager.initToken).toHaveBeenCalledExactlyOnceWith()
    })

    it('should register an unauthorized callback', () => {
      const currentLayout = computed(() => Layout.MAIN)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      expect(setUnauthorizedCallback).toHaveBeenCalledExactlyOnceWith(expect.any(Function))
    })

    it('should register a token refresh strategy', () => {
      const currentLayout = computed(() => Layout.MAIN)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      expect(TokenRefreshService.registerRefreshStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(Function))
    })
  })

  describe('unauthorized callback', () => {
    it('should clear token and redirect to login when not on login layout', async () => {
      const currentLayout = computed(() => Layout.MAIN)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      const callback = vi.mocked(setUnauthorizedCallback).mock.calls[0][0] as () => Promise<void>
      await callback()

      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith('')
      expect(mockRouter.replace).toHaveBeenCalledWith({
        name: RouteName.LOGIN_COLLAB,
        query: { sessionExpired: 'true' },
      })
    })

    it('should clear token but not redirect when already on login layout', async () => {
      const currentLayout = computed(() => Layout.LOGIN)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      const callback = vi.mocked(setUnauthorizedCallback).mock.calls[0][0] as () => Promise<void>
      await callback()

      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith('')
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })
  })

  describe('token refresh strategy', () => {
    it('should return a fresh MSAL token', async () => {
      const currentLayout = computed(() => Layout.MAIN)
      vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue('fresh-msal-token')

      CollaboratorAuthService.init(mockRouter, currentLayout)

      const strategy = vi.mocked(TokenRefreshService.registerRefreshStrategy).mock.calls[0][0]
      const token = await strategy()

      expect(MsalService.getFreshMSALToken).toHaveBeenCalledExactlyOnceWith()
      expect(token).toBe('fresh-msal-token')
    })

    it('should throw when MsalService returns null', async () => {
      const currentLayout = computed(() => Layout.MAIN)
      vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue(null)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      const strategy = vi.mocked(TokenRefreshService.registerRefreshStrategy).mock.calls[0][0]

      await expect(strategy()).rejects.toThrow('Failed to refresh MSAL token')
    })

    it('should throw when MsalService returns undefined', async () => {
      const currentLayout = computed(() => Layout.MAIN)
      vi.mocked(MsalService.getFreshMSALToken).mockResolvedValue(undefined)

      CollaboratorAuthService.init(mockRouter, currentLayout)

      const strategy = vi.mocked(TokenRefreshService.registerRefreshStrategy).mock.calls[0][0]

      await expect(strategy()).rejects.toThrow('Failed to refresh MSAL token')
    })
  })
})
