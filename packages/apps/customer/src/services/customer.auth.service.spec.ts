import { CustomerAuthService } from './customer.auth.service'
import { CurrentUserManager } from '@pulse/common/managers'
import { setUnauthorizedCallback } from '@pulse/common/unauthorized-callback'
import { TokenRefreshService } from '@pulse/common/services/token-refresh'
import { refreshClientToken } from '@pulse/common/services/authentication'
import { Layout } from '@pulse/common/enums'
import { CustomerAnonymousFlowManager } from '../managers/customer.anonymous.flow.manager'
import type { Router } from 'vue-router'
import { computed } from 'vue'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    initToken: vi.fn(),
    persistToken: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
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

vi.mock('@pulse/common/services/authentication', () => ({
  refreshClientToken: vi.fn(),
}))

vi.mock('../managers/customer.anonymous.flow.manager', () => ({
  CustomerAnonymousFlowManager: {
    getLandingPage: vi.fn(),
  },
}))

describe('CustomerAuthService', () => {
  const mockRouter = {
    replace: vi.fn(),
  } as unknown as Router

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('init', () => {
    it('should call CurrentUserManager.initToken', () => {
      const currentLayout = computed(() => Layout.MAIN)

      CustomerAuthService.init(mockRouter, currentLayout)

      expect(CurrentUserManager.initToken).toHaveBeenCalledExactlyOnceWith()
    })

    it('should register an unauthorized callback', () => {
      const currentLayout = computed(() => Layout.MAIN)

      CustomerAuthService.init(mockRouter, currentLayout)

      expect(setUnauthorizedCallback).toHaveBeenCalledExactlyOnceWith(expect.any(Function))
    })

    it('should register a token refresh strategy', () => {
      const currentLayout = computed(() => Layout.MAIN)

      CustomerAuthService.init(mockRouter, currentLayout)

      expect(TokenRefreshService.registerRefreshStrategy).toHaveBeenCalledExactlyOnceWith(expect.any(Function))
    })
  })

  describe('unauthorized callback', () => {
    it('should clear token, logout and redirect when not on login layout', async () => {
      const currentLayout = computed(() => Layout.MAIN)
      const landingPage = { name: 'landing' }
      vi.mocked(CustomerAnonymousFlowManager.getLandingPage).mockReturnValue(landingPage as any)

      CustomerAuthService.init(mockRouter, currentLayout)

      const callback = vi.mocked(setUnauthorizedCallback).mock.calls[0][0] as () => Promise<void>
      await callback()

      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith('')
      expect(CurrentUserManager.logout).toHaveBeenCalledExactlyOnceWith()
      expect(CustomerAnonymousFlowManager.getLandingPage).toHaveBeenCalledExactlyOnceWith()
      expect(mockRouter.replace).toHaveBeenCalledWith({
        ...landingPage,
        query: { sessionExpired: 'true' },
      })
    })

    it('should clear token but not redirect when already on login layout', async () => {
      const currentLayout = computed(() => Layout.LOGIN)

      CustomerAuthService.init(mockRouter, currentLayout)

      const callback = vi.mocked(setUnauthorizedCallback).mock.calls[0][0] as () => Promise<void>
      await callback()

      expect(CurrentUserManager.persistToken).toHaveBeenCalledWith('')
      expect(CurrentUserManager.logout).not.toHaveBeenCalled()
      expect(mockRouter.replace).not.toHaveBeenCalled()
    })
  })

  describe('token refresh strategy', () => {
    it('should call refreshClientToken', async () => {
      const currentLayout = computed(() => Layout.MAIN)
      vi.mocked(refreshClientToken).mockResolvedValue('fresh-gigya-token')

      CustomerAuthService.init(mockRouter, currentLayout)

      const strategy = vi.mocked(TokenRefreshService.registerRefreshStrategy).mock.calls[0][0]
      const token = await strategy()

      expect(refreshClientToken).toHaveBeenCalledExactlyOnceWith()
      expect(token).toBe('fresh-gigya-token')
    })
  })
})
