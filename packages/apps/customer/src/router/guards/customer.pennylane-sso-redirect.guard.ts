import type { NavigationGuard } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoProvider, SsoQueryParam } from '@pulse/common/services/storage'

export const customerPennylaneSsoRedirectGuard: NavigationGuard = (_to, _from, next) => {
  if (FeatureFlagManager.isPennylaneSsoRedirectActivated() === false) {
    return next()
  }

  const ssoContext = SessionStorageService.consumeSamlSsoContext(SsoProvider.PENNYLANE)
  if (ssoContext === undefined) {
    return next()
  }

  return next({
    name: RouteName.PENNYLANE_SSO_PROXY,
    query: {
      [SsoQueryParam.SP_NAME]: ssoContext.spName,
      [SsoQueryParam.SAML_CONTEXT]: ssoContext.samlContext,
      [SsoQueryParam.MODE]: ssoContext.mode,
    },
  })
}
