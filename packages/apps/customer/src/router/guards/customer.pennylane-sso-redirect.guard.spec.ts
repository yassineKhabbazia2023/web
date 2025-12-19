import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoQueryParam, SsoProvider } from '@pulse/common/services/storage'
import { customerPennylaneSsoRedirectGuard } from './customer.pennylane-sso-redirect.guard'

vi.mock('@pulse/common/managers', () => ({
  FeatureFlagManager: {
    isPennylaneSsoRedirectActivated: vi.fn(),
  },
}))
vi.mock('@pulse/common/services/storage', () => ({
  SessionStorageService: {
    consumeSamlSsoContext: vi.fn(),
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

describe('customerPennylaneSsoRedirectGuard', () => {
  const nextMock = vi.fn()
  let toRoute: Partial<RouteLocationNormalized>
  let fromRoute: Partial<RouteLocationNormalized>

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(FeatureFlagManager.isPennylaneSsoRedirectActivated).mockReturnValue(true)
    toRoute = {
      query: {},
    }
    fromRoute = {
      query: {},
    }
  })

  it('should skip redirect when feature flag is disabled', () => {
    vi.mocked(FeatureFlagManager.isPennylaneSsoRedirectActivated).mockReturnValue(false)

    customerPennylaneSsoRedirectGuard(
      toRoute as RouteLocationNormalized,
      fromRoute as RouteLocationNormalized,
      nextMock,
    )

    expect(SessionStorageService.consumeSamlSsoContext).not.toHaveBeenCalled()
    expect(nextMock).toHaveBeenCalledWith()
  })

  it('should call next() when no Pennylane SSO context is present', () => {
    vi.mocked(SessionStorageService.consumeSamlSsoContext).mockReturnValue(undefined)

    customerPennylaneSsoRedirectGuard(
      toRoute as RouteLocationNormalized,
      fromRoute as RouteLocationNormalized,
      nextMock,
    )

    expect(SessionStorageService.consumeSamlSsoContext).toHaveBeenCalledWith('pennylane')
    expect(nextMock).toHaveBeenCalledWith()
  })

  it('should redirect to PENNYLANE_SSO_PROXY when Pennylane SSO context is present', () => {
    const ssoContext = {
      spName: SsoProvider.PENNYLANE,
      samlContext: 'test-context-123',
      mode: 'login',
    }
    vi.mocked(SessionStorageService.consumeSamlSsoContext).mockReturnValue(ssoContext)

    customerPennylaneSsoRedirectGuard(
      toRoute as RouteLocationNormalized,
      fromRoute as RouteLocationNormalized,
      nextMock,
    )

    expect(SessionStorageService.consumeSamlSsoContext).toHaveBeenCalledWith('pennylane')
    expect(nextMock).toHaveBeenCalledWith({
      name: RouteName.PENNYLANE_SSO_PROXY,
      query: {
        [SsoQueryParam.SP_NAME]: 'pennylane',
        [SsoQueryParam.SAML_CONTEXT]: 'test-context-123',
        [SsoQueryParam.MODE]: 'login',
      },
    })
  })
})
