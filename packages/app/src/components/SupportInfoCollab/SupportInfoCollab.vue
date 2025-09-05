<template>
  <p class="support font-small">
    {{ t('contactSupport') }}
    <a
      :href="phoneSanitizedUrl"
      class="link"
      data-testid="phone-link"
    >
      {{ SUPPORT_PHONE_COLLAB }}
    </a>
  </p>
  <p class="margin-top--1">
    {{ APP_COPYRIGHT }}
  </p>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { computed } from 'vue'
import { APP_COPYRIGHT, SUPPORT_PHONE_COLLAB, SUPPORT_PHONE_COLLAB_LINK } from '@pulse/core'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const phoneSanitizedUrl = computed(() => {
  return sanitizeUrl(`tel:${SUPPORT_PHONE_COLLAB_LINK}`)
})
</script>

<style lang="scss" scoped>
.support {
  color: var(--p-white);

  &__copyright {
    appearance: none;
    background: none;
    border: none;
  }
}
.link {
  font-size: 1.2rem;
  color: var(--p-white)
}
</style>

<i18n lang="yaml">
en-US:
  contactSupport: 'Support contact: '
fr-FR:
  contactSupport: 'Contact support : '
</i18n>
