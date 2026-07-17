import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, CookieService } from '@pulse/common/services/storage'
import { pennylaneSsoGuard } from './pennylane-sso.guard'
const mockCookieGet = vi.fn()
const mockCookieRemove = vi.fn()
const mockGetSamlSsoContext = vi.fn()
const mockRemoveSamlSsoContext = vi.fn()
const mockIsPennylaneSsoRedirectActivated = vi.fn()

beforeEach(() => {
  vi.spyOn(FeatureFlagManager, 'isPennylaneSsoRedirectActivated')
    .mockImplementation(() => mockIsPennylaneSsoRedirectActivated())
  vi.mocked(CookieService.get).mockImplementation((...args: unknown[]) => mockCookieGet(...args))
  vi.mocked(CookieService.remove).mockImplementation((...args: unknown[]) => mockCookieRemove(...args))
  vi.mocked(SessionStorageService.getSamlSsoContext)
    .mockImplementation((...args: unknown[]) => mockGetSamlSsoContext(...args))
  vi.mocked(SessionStorageService.removeSamlSsoContext)
    .mockImplementation((...args: unknown[]) => mockRemoveSamlSsoContext(...args))
})

describe('pennylaneSsoGuard', () => {
  beforeEach(() => {
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
