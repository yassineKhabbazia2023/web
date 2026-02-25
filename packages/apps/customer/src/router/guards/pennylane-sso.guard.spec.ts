import { describe, it, expect, vi, beforeEach } from 'vitest'
import { pennylaneSsoGuard } from './pennylane-sso.guard'
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
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsPennylaneSsoRedirectActivated.mockReturnValue(true)
  })

  describe('when feature flag is disabled', () => {
    beforeEach(() => {
      mockIsPennylaneSsoRedirectActivated.mockReturnValue(false)
    })

    it('should return undefined without checking cookie', () => {
      const result = pennylaneSsoGuard()

      expect(result).toBeUndefined()
      expect(mockCookieGet).not.toHaveBeenCalled()
    })
  })

  describe('when feature flag is enabled', () => {
    describe('when cookie indicates origin is NOT from Rydge', () => {
      it('should return undefined and not consume anything when no cookie', () => {
        mockCookieGet.mockReturnValue(undefined)

        const result = pennylaneSsoGuard()

        expect(mockCookieGet).toHaveBeenCalledWith('sso-origin')
        expect(mockGetSamlSsoContext).not.toHaveBeenCalled()
        expect(mockCookieRemove).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
      })

      it('should return undefined and not consume anything when cookie has wrong value', () => {
        mockCookieGet.mockReturnValue('other-value')

        const result = pennylaneSsoGuard()

        expect(mockGetSamlSsoContext).not.toHaveBeenCalled()
        expect(mockCookieRemove).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
      })
    })

    describe('when cookie indicates origin is from Rydge', () => {
      beforeEach(() => {
        mockCookieGet.mockReturnValue('rydge')
      })

      it('should return undefined and not consume cookie when no SSO context in sessionStorage', () => {
        mockGetSamlSsoContext.mockReturnValue(undefined)

        const result = pennylaneSsoGuard()

        expect(mockCookieGet).toHaveBeenCalledWith('sso-origin')
        expect(mockGetSamlSsoContext).toHaveBeenCalledWith('pennylane')
        expect(mockCookieRemove).not.toHaveBeenCalled()
        expect(mockRemoveSamlSsoContext).not.toHaveBeenCalled()
        expect(result).toBeUndefined()
      })

      it('should consume both and redirect when cookie and SSO context exist', () => {
        mockGetSamlSsoContext.mockReturnValue({
          spName: 'pennylane',
          samlContext: 'test-context',
          mode: 'login',
        })

        const result = pennylaneSsoGuard()

        expect(mockCookieGet).toHaveBeenCalledWith('sso-origin')
        expect(mockGetSamlSsoContext).toHaveBeenCalledWith('pennylane')
        expect(mockCookieRemove).toHaveBeenCalledWith('sso-origin')
        expect(mockRemoveSamlSsoContext).toHaveBeenCalledWith('pennylane')
        expect(result).toEqual({
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
