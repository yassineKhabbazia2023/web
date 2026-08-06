import { SessionStorageService, SsoProvider, CookieService } from '@pulse/common/services/storage'
import { RouteName } from '@pulse/common/enums'
import { SSO_ORIGIN_COOKIE, SSO_ORIGIN_RYDGE } from '@pulse/common/constants'

export function pennylaneSsoGuard() {
  // Check SSO connection origin
  const ssoOrigin = CookieService.get(SSO_ORIGIN_COOKIE)
  const isFromRydge = ssoOrigin === SSO_ORIGIN_RYDGE

  if (isFromRydge === false) {
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
