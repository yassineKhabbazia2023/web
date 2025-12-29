import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePennylaneSso } from './pennylane-sso.composable'

const mockResolve = vi.fn()
const mockHasRoute = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    resolve: mockResolve,
    hasRoute: mockHasRoute,
  }),
}))

vi.mock('@pulse/toolbox/utils/url', () => ({
  sanitizeUrl: (url: string) => url,
}))

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: {
    isPennylaneSsoRedirectActivated: vi.fn(),
  },
}))

vi.mock('@pulse/common/services/storage', () => ({
  SessionStorageService: {
    getSamlSsoContext: vi.fn(),
    removeSamlSsoContext: vi.fn(),
  },
  SsoProvider: {
    PENNYLANE: 'pennylane',
  },
  SsoQueryParam: {
    SP_NAME: 'spName',
    SAML_CONTEXT: 'samlContext',
    MODE: 'mode',
  },
}))

vi.mock('env-vars', () => ({
  VITE_PENNYLANE_SSO_URL: 'https://pennylane-sso.example.com',
  VITE_PENNYLANE_COLLAB_SSO_URL: 'https://pennylane-collab-sso.example.com',
}))

vi.mock('@pulse/common/enums', () => ({
  RouteName: {
    PENNYLANE_SSO_PROXY: 'pennylane-sso-proxy',
  },
}))

import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoProvider } from '@pulse/common/services/storage'

describe('usePennylaneSso', () => {
  beforeEach(() => {
    mockResolve.mockReturnValue({ href: '/pennylane-sso-proxy?params' })
    mockHasRoute.mockReturnValue(true)
  })

  describe('when feature flag is disabled', () => {
    beforeEach(() => {
      vi.mocked(FeatureFlagManager.isPennylaneSsoRedirectActivated).mockReturnValue(false)
    })

    it('should return direct URL', () => {
      const { url } = usePennylaneSso()

      expect(url.value).toBe('https://pennylane-sso.example.com')
    })

    it('should return collab direct URL when isCollab is true', () => {
      const { url } = usePennylaneSso({ isCollab: true })

      expect(url.value).toBe('https://pennylane-collab-sso.example.com')
    })
  })

  describe('when feature flag is enabled', () => {
    beforeEach(() => {
      vi.mocked(FeatureFlagManager.isPennylaneSsoRedirectActivated).mockReturnValue(true)
    })

    it('should return direct URL when no SSO context exists', () => {
      vi.mocked(SessionStorageService.getSamlSsoContext).mockReturnValue(undefined)

      const { url } = usePennylaneSso()

      expect(url.value).toBe('https://pennylane-sso.example.com')
    })

    it('should return proxy URL when SSO context exists', () => {
      vi.mocked(SessionStorageService.getSamlSsoContext).mockReturnValue({
        spName: SsoProvider.PENNYLANE,
        samlContext: 'test-context',
        mode: 'login',
      })

      const { url } = usePennylaneSso()

      expect(url.value).toBe('/pennylane-sso-proxy?params')
      expect(mockResolve).toHaveBeenCalledWith({
        name: 'pennylane-sso-proxy',
        query: {
          spName: 'pennylane',
          samlContext: 'test-context',
          mode: 'login',
        },
      })
    })

    it('should return direct URL when route does not exist', () => {
      mockHasRoute.mockReturnValue(false)
      vi.mocked(SessionStorageService.getSamlSsoContext).mockReturnValue({
        spName: SsoProvider.PENNYLANE,
        samlContext: 'test-context',
        mode: 'login',
      })

      const { url } = usePennylaneSso()

      expect(url.value).toBe('https://pennylane-sso.example.com')
    })

    it('should return isProxyUrl true when proxy URL is used', () => {
      vi.mocked(SessionStorageService.getSamlSsoContext).mockReturnValue({
        spName: SsoProvider.PENNYLANE,
        samlContext: 'test-context',
        mode: 'login',
      })

      const { isProxyUrl } = usePennylaneSso()

      expect(isProxyUrl.value).toBe(true)
    })

    it('should return isProxyUrl false when direct URL is used', () => {
      vi.mocked(SessionStorageService.getSamlSsoContext).mockReturnValue(undefined)

      const { isProxyUrl } = usePennylaneSso()

      expect(isProxyUrl.value).toBe(false)
    })

    it('should clear SSO context when clearSsoContext is called', () => {
      const { clearSsoContext } = usePennylaneSso()

      clearSsoContext()

      expect(SessionStorageService.removeSamlSsoContext).toHaveBeenCalledWith(SsoProvider.PENNYLANE)
    })
  })
})
