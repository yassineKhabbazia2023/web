import { SessionStorageService, SsoProvider, CookieService } from '@pulse/common/services/storage'
import { RouteName } from '@pulse/common/enums'
import { SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE } from '@pulse/common/constants'
import { FeatureFlagManager } from '@pulse/common/managers'

export function pennylaneSsoGuard() {
  // Check SSO connection origin
  const ssoOrigin = CookieService.get(SSO_ORIGIN_COOKIE)
  const isFromRydge = ssoOrigin === SSO_ORIGIN_RYDGE

  // temp bypass for clients whose SSO doesn't redirect back to Pennylane properly
  const shouldForceProxy = isFromRydge === true || FeatureFlagManager.isPennylaneSsoForceProxyActivated() === true

  if (shouldForceProxy === false) {
    return
  }

  // Check if SAML context exists
  const ssoContext = SessionStorageService.getSamlSsoContext(SsoProvider.PENNYLANE)

  if (ssoContext === undefined) {
    return
  }

  CookieService.remove(SSO_ORIGIN_COOKIE)
  SessionStorageService.removeSamlSsoContext(SsoProvider.PENNYLANE)

  const { spName, samlContext, mode } = ssoContext

  return {
    name: RouteName.PENNYLANE_SSO_PROXY,
    query: { spName, samlContext, mode },
  }
}
