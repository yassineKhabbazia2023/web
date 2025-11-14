<template>
  <ul class="list-style-none">
    <li class="text-center">
      {{ t('contactSupport') }} <span class="no-wrap">{{ supportPhoneNumber }}</span><br>
    </li>
    <li class="text-center">
      {{ APP_COPYRIGHT }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@pulse/common/stores'
import { APP_COPYRIGHT, SUPPORT_PHONE_CLIENT, SUPPORT_PHONE_COLLAB } from '@pulse/common/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const userStore = useUserStore()

const supportPhoneNumber = userStore.isCollab ? SUPPORT_PHONE_COLLAB : SUPPORT_PHONE_CLIENT
</script>


<i18n lang="yaml">
  en-US:
    contactSupport: 'Support contact:'
  fr-FR:
    contactSupport: 'Contact Support :'
  </i18n>
