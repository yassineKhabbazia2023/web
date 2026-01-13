import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pennylaneSsoGuard } from './pennylane-sso.guard'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const mockCookieGet = vi.fn()
const mockCookieRemove = vi.fn()
const mockGetSamlSsoContext = vi.fn()
const mockRemoveSamlSsoContext = vi.fn()
const mockIsPennylaneSsoRedirectActivated = vi.fn()

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: {
    isPennylaneSsoRedirectActivated: () => mockIsPennylaneSsoRedirectActivated(),
  },
}))

vi.mock('@pulse/common/services/storage', () => ({
  SessionStorageService: {
    getSamlSsoContext: (...args: unknown[]) => mockGetSamlSsoContext(...args),
    removeSamlSsoContext: (...args: unknown[]) => mockRemoveSamlSsoContext(...args),
  },
  CookieService: {
    get: (...args: unknown[]) => mockCookieGet(...args),
    remove: (...args: unknown[]) => mockCookieRemove(...args),
  },
  SsoProvider: {
    PENNYLANE: 'pennylane',
  },
}))

vi.mock('@pulse/common/enums', () => ({
  RouteName: {
    PENNYLANE_SSO_PROXY: 'pennylane-sso-proxy',
  },
}))

vi.mock('@pulse/common/constants', () => ({
  SSO_ORIGIN_COOKIE: 'sso-origin',
  SSO_ORIGIN_RYDGE: 'rydge',
}))

describe('pennylaneSsoGuard', () => {
  let nextMock: NavigationGuardNext
  let toRouteMock: RouteLocationNormalized
  let fromRouteMock: RouteLocationNormalized

  beforeEach(() => {
    vi.clearAllMocks()
    nextMock = vi.fn()
    toRouteMock = {} as RouteLocationNormalized
    fromRouteMock = {} as RouteLocationNormalized
    mockIsPennylaneSsoRedirectActivated.mockReturnValue(true)
  })

  describe('when feature flag is disabled', () => {
    beforeEach(() => {
      mockIsPennylaneSsoRedirectActivated.mockReturnValue(false)
    })

    it('should call next() without checking cookie', () => {
      pennylaneSsoGuard(toRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith()
      expect(mockCookieGet).not.toHaveBeenCalled()
    })
  })

  describe('when feature flag is enabled', () => {
    describe('when cookie indicates origin is NOT from Rydge', () => {
      it('should call next() and not consume anything when no cookie', () => {
        mockCookieGet.mockReturnValue(undefined)

        pennylaneSsoGuard(toRouteMock, fromRouteMock, nextMock)

        expect(mockCookieGet).toHaveBeenCalledWith('sso-origin')
        expect(mockGetSamlSsoContext).not.toHaveBeenCalled()
        expect(mockCookieRemove).not.toHaveBeenCalled()
        expect(nextMock).toHaveBeenCalledWith()
      })

      it('should call next() and not consume anything when cookie has wrong value', () => {
        mockCookieGet.mockReturnValue('other-value')

        pennylaneSsoGuard(toRouteMock, fromRouteMock, nextMock)

        expect(mockGetSamlSsoContext).not.toHaveBeenCalled()
        expect(mockCookieRemove).not.toHaveBeenCalled()
        expect(nextMock).toHaveBeenCalledWith()
      })
    })

    describe('when cookie indicates origin is from Rydge', () => {
      beforeEach(() => {
        mockCookieGet.mockReturnValue('rydge')
      })

      it('should call next() and not consume cookie when no SSO context in sessionStorage', () => {
        mockGetSamlSsoContext.mockReturnValue(undefined)

        pennylaneSsoGuard(toRouteMock, fromRouteMock, nextMock)

        expect(mockCookieGet).toHaveBeenCalledWith('sso-origin')
        expect(mockGetSamlSsoContext).toHaveBeenCalledWith('pennylane')
        expect(mockCookieRemove).not.toHaveBeenCalled()
        expect(mockRemoveSamlSsoContext).not.toHaveBeenCalled()
        expect(nextMock).toHaveBeenCalledWith()
      })

      it('should consume both and redirect when cookie and SSO context exist', () => {
        mockGetSamlSsoContext.mockReturnValue({
          spName: 'pennylane',
          samlContext: 'test-context',
          mode: 'login',
        })

        pennylaneSsoGuard(toRouteMock, fromRouteMock, nextMock)

        expect(mockCookieGet).toHaveBeenCalledWith('sso-origin')
        expect(mockGetSamlSsoContext).toHaveBeenCalledWith('pennylane')
        expect(mockCookieRemove).toHaveBeenCalledWith('sso-origin')
        expect(mockRemoveSamlSsoContext).toHaveBeenCalledWith('pennylane')
        expect(nextMock).toHaveBeenCalledWith({
          name: 'pennylane-sso-proxy',
          query: {
            spName: 'pennylane',
            samlContext: 'test-context',
            mode: 'login',
          },
        })
      })
    })
  })
})
