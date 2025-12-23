import type { NavigationGuard } from 'vue-router'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoProvider, SsoQueryParam } from '@pulse/common/services/storage'

export const customerSsoGuard: NavigationGuard = (to, _from, next) => {
  const spName = to.query[SsoQueryParam.SP_NAME] as SsoProvider | undefined
  if (spName === undefined) {
    return next()
  }

  const samlContext = to.query[SsoQueryParam.SAML_CONTEXT] as string | undefined
  const mode = to.query[SsoQueryParam.MODE] as string | undefined

  // Pennylane SSO: store context for manual redirect via homepage button
  if (spName === SsoProvider.PENNYLANE) {
    if (FeatureFlagManager.isPennylaneSsoRedirectActivated() && samlContext && mode) {
      SessionStorageService.setSamlSsoContext({ spName, samlContext, mode })
    }
  }

  return next()
}
