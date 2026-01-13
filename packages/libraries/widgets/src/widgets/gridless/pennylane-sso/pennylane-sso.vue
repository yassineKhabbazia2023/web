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
import { PButton, PIcon } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PennylaneSsoManager } from '@pulse/common/managers'
import { PennylaneSSOProps } from './pennylane-sso.types'
import { SsoTracking } from './pennylane-sso.enums'
import { AmplitudeTrackingLocation } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<PennylaneSSOProps>()

const ssoUrl = computed(() => PennylaneSsoManager.getUrl(props.isCollab))

const onSSOConnection = () => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: SsoTracking.SSO_PENNYLANE,
    feature_consultation_localisation: AmplitudeTrackingLocation.HOMEPAGE,
  })
  PennylaneSsoManager.setSsoOrigin()
}
</script>
