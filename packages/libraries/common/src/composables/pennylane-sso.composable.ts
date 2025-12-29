import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoProvider, SsoQueryParam } from '@pulse/common/services/storage'
import { RouteName } from '@pulse/common/enums'
import { VITE_PENNYLANE_COLLAB_SSO_URL, VITE_PENNYLANE_SSO_URL } from 'env-vars'
import type { UsePennylaneSsoOptions } from './pennylane-sso.composable.types'

export function usePennylaneSso(options: UsePennylaneSsoOptions = {}) {
  const router = useRouter()

  const directUrl = computed(() => {
    const envUrl = options.isCollab ? VITE_PENNYLANE_COLLAB_SSO_URL : VITE_PENNYLANE_SSO_URL
    return sanitizeUrl(envUrl)
  })

  const ssoProxyUrl = computed(() => {
    if (FeatureFlagManager.isPennylaneSsoRedirectActivated() === false) {
      return undefined
    }
    if (router.hasRoute(RouteName.PENNYLANE_SSO_PROXY) === false) {
      return undefined
    }
    const ssoContext = SessionStorageService.getSamlSsoContext(SsoProvider.PENNYLANE)
    if (ssoContext === undefined) {
      return undefined
    }
    return router.resolve({
      name: RouteName.PENNYLANE_SSO_PROXY,
      query: {
        [SsoQueryParam.SP_NAME]: ssoContext.spName,
        [SsoQueryParam.SAML_CONTEXT]: ssoContext.samlContext,
        [SsoQueryParam.MODE]: ssoContext.mode,
      },
    }).href
  })

  const url = computed(() => ssoProxyUrl.value ?? directUrl.value)

  const isProxyUrl = computed(() => ssoProxyUrl.value !== undefined)

  function clearSsoContext() {
    SessionStorageService.removeSamlSsoContext(SsoProvider.PENNYLANE)
  }

  return { url, isProxyUrl, clearSsoContext }
}
