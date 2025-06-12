<template>
  <div class="widget-sso">
    <PButton
      pTag="a"
      :href="sanitizeUrl(SSOUrl)"
      target="_blank"
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
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { PennylaneSSOProps } from './pennylane-sso.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<PennylaneSSOProps>()

</script>

<i18n lang="yaml">
en-US:
  accessToPennylane: 'Access to Pennylane'
fr-FR:
  accessToPennylane: 'Accéder à Pennylane'
</i18n>
