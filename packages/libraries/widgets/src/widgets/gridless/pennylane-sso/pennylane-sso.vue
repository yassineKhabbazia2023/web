<template>
  <div
    class="widget-sso"
    data-testid="widget-pennylane-sso"
  >
    <PButton
      pTag="a"
      :href="ssoUrl"
      target="_blank"
      @click="onSSOConnection"
    >
      <PIcon pName="pennylaneColor" />

      <div class="margin-x--2">
        {{ t('widgets.pennylaneSSO.accessToPennylane') }}
      </div>

      <PIcon pName="arrowRight" />
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { FeatureFlagManager } from '@pulse/common/managers'
import { SessionStorageService, SsoProvider, SsoQueryParam } from '@pulse/common/services/storage'
import { PennylaneSSOProps } from './pennylane-sso.types'
import { SsoTracking } from './pennylane-sso.enums'
import { VITE_PENNYLANE_COLLAB_SSO_URL, VITE_PENNYLANE_SSO_URL } from 'env-vars'
import { AmplitudeTrackingLocation, RouteName } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const router = useRouter()
const props = defineProps<PennylaneSSOProps>()

const directSsoUrl = computed(() => {
  const url = props.isCollab ? VITE_PENNYLANE_COLLAB_SSO_URL : VITE_PENNYLANE_SSO_URL
  return sanitizeUrl(url)
})

const ssoProxyUrl = computed(() => {
  if (FeatureFlagManager.isPennylaneSsoRedirectActivated() === false) {
    return
  }
  // Early exit if the app doesn't have a proxy SSO Pennylane
  if (router.hasRoute(RouteName.PENNYLANE_SSO_PROXY) === false) {
    return
  }
  const ssoContext = SessionStorageService.getSamlSsoContext(SsoProvider.PENNYLANE)
  if (ssoContext === undefined) {
    return
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

const ssoUrl = computed(() => ssoProxyUrl.value ?? directSsoUrl.value)

const onSSOConnection = () => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: SsoTracking.SSO_PENNYLANE,
    feature_consultation_localisation: AmplitudeTrackingLocation.HOMEPAGE,
  })

  if (ssoProxyUrl.value !== undefined) {
    SessionStorageService.removeSamlSsoContext(SsoProvider.PENNYLANE)
  }
}
</script>
