<template>
  <p class="support font-small">
    {{ t('contactSupport') }}
    <a
      :href="phoneSanitizedUrl"
      class="link"
      data-testid="phone-link"
    >
      {{ SUPPORT_PHONE_CLIENT }}
    </a>
    {{ t('emailLabel') }}
    <a
      :href="emailSanitizedUrl"
      class="link"
      data-testid="email-link"
    >
      {{ SUPPORT_EMAIL_CLIENT }}
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
import { APP_COPYRIGHT, SUPPORT_PHONE_CLIENT, SUPPORT_PHONE_CLIENT_LINK, SUPPORT_EMAIL_CLIENT } from '@pulse/core'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const phoneSanitizedUrl = computed(() => {
  return sanitizeUrl(`tel:${SUPPORT_PHONE_CLIENT_LINK}`)
})
const emailSanitizedUrl = computed(() => {
  return sanitizeUrl(`mailto:${SUPPORT_EMAIL_CLIENT}`)
})
</script>

<style lang="scss" scoped>
.support {
  color: var(--el-color-white);

  &__copyright {
    appearance: none;
    background: none;
    border: none;
  }
}
.link {
  font-size: 1.2rem;
  color: var(--el-color-white)
}
</style>

<i18n lang="yaml">
en-US:
  contactSupport: 'Support contact: '
  emailLabel: ' — email : '
fr-FR:
  contactSupport: 'Contact support : '
  emailLabel: ' — email : '
</i18n>
