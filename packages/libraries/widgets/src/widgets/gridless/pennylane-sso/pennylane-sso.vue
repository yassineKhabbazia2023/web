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
        {{ t('accessToPennylane') }}
      </div>

      <PIcon pName="arrowRight" />
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PennylaneSSOProps } from './pennylane-sso.types'
import { SsoTracking } from './pennylane-sso.enums'
import { VITE_PENNYLANE_COLLAB_SSO_URL, VITE_PENNYLANE_SSO_URL } from 'env-vars'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<PennylaneSSOProps>()

const ssoUrl = computed(() => {
  const url = props.isCollab ? VITE_PENNYLANE_COLLAB_SSO_URL : VITE_PENNYLANE_SSO_URL

  return sanitizeUrl(url)
})

const onSSOConnection = () => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: SsoTracking.SSO_PENNYLANE,
  })
}
</script>

<i18n lang="yaml">
en-US:
  accessToPennylane: 'Access to Pennylane'
fr-FR:
  accessToPennylane: 'Accéder à Pennylane'
</i18n>
