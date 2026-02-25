import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService } from '@pulse/common/services/storage'
import { customerSsoGuard } from './customer.sso.guard'

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: {
    isPennylaneSsoRedirectActivated: vi.fn(),
  },
}))
vi.mock('@pulse/common/services/storage', () => ({
  SessionStorageService: {
    setSamlSsoContext: vi.fn(),
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


describe('customerSsoGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when feature flag is disabled', () => {
    beforeEach(() => {
      vi.mocked(FeatureFlagManager.isPennylaneSsoRedirectActivated).mockReturnValue(false)
    })

    it('should proceed without storing SSO context even if query params are present', () => {
      const toRoute: any = {
        query: {
          spName: 'pennylane',
          samlContext: 'test-saml-context',
          mode: 'login',
        },
      }

      const result = customerSsoGuard(toRoute)

      expect(SessionStorageService.setSamlSsoContext).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe('when feature flag is enabled', () => {
    beforeEach(() => {
      vi.mocked(FeatureFlagManager.isPennylaneSsoRedirectActivated).mockReturnValue(true)
    })

    it('should store SSO context when Pennylane query params are present', () => {
      const toRoute: any = {
        query: {
          spName: 'pennylane',
          samlContext: 'test-saml-context',
          mode: 'login',
        },
      }

      const result = customerSsoGuard(toRoute)

      expect(SessionStorageService.setSamlSsoContext).toHaveBeenCalledWith({
        spName: 'pennylane',
        samlContext: 'test-saml-context',
        mode: 'login',
      })
      expect(result).toBeUndefined()
    })

    it('should not store SSO context when samlContext is missing', () => {
      const toRoute: any = {
        query: {
          spName: 'pennylane',
          mode: 'login',
        },
      }

      const result = customerSsoGuard(toRoute)

      expect(SessionStorageService.setSamlSsoContext).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should not store SSO context when mode is missing', () => {
      const toRoute: any = {
        query: {
          spName: 'pennylane',
          samlContext: 'test-saml-context',
        },
      }

      const result = customerSsoGuard(toRoute)

      expect(SessionStorageService.setSamlSsoContext).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })

  describe('early exit when no spName query param', () => {
    it('should not check feature flag when spName is not present', () => {
      const toRoute: any = {
        query: {},
      }

      const result = customerSsoGuard(toRoute)

      expect(FeatureFlagManager.isPennylaneSsoRedirectActivated).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })

    it('should not store SSO context when spName is not pennylane', () => {
      const toRoute: any = {
        query: {
          spName: 'other-provider',
          samlContext: 'test-saml-context',
          mode: 'login',
        },
      }

      const result = customerSsoGuard(toRoute)

      expect(FeatureFlagManager.isPennylaneSsoRedirectActivated).not.toHaveBeenCalled()
      expect(SessionStorageService.setSamlSsoContext).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
