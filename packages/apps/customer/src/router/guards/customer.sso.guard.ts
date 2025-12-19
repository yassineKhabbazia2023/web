import type { NavigationGuard } from 'vue-router'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoProvider, SsoQueryParam } from '@pulse/common/services/storage'

export const customerSsoGuard: NavigationGuard = (to, _from, next) => {
  // Exit early if no SSO query params
  const spName = to.query[SsoQueryParam.SP_NAME] as SsoProvider | undefined
  if (spName === undefined) {
    return next()
  }

  const samlContext = to.query[SsoQueryParam.SAML_CONTEXT] as string | undefined
  const mode = to.query[SsoQueryParam.MODE] as string | undefined

  // Pennylane SSO
  if (spName === SsoProvider.PENNYLANE) {
    if (FeatureFlagManager.isPennylaneSsoRedirectActivated() && samlContext && mode) {
      SessionStorageService.setSamlSsoContext({ spName, samlContext, mode })
    }
  }

  return next()
}
