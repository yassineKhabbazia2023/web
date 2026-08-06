import type { RouteLocationNormalized } from 'vue-router'
import { SessionStorageService, SsoProvider, SsoQueryParam } from '@pulse/common/services/storage'

export function customerSsoGuard(to: RouteLocationNormalized) {
  const spName = to.query[SsoQueryParam.SP_NAME] as SsoProvider | undefined
  if (spName === undefined) {
    return
  }

  const samlContext = to.query[SsoQueryParam.SAML_CONTEXT] as string | undefined
  const mode = to.query[SsoQueryParam.MODE] as string | undefined

  // Pennylane SSO: store context for manual redirect via homepage button
  if (spName === SsoProvider.PENNYLANE) {
    if (samlContext && mode) {
      SessionStorageService.setSamlSsoContext({ spName, samlContext, mode })
    }
  }
}
