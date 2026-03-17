<template>
  <ProfilePageLayout
    footer-id="my-information__footer-page"
    :title="t('title')"
  >
    <MyInformation standalone />
  </ProfilePageLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import MyInformation from '@shared/layouts/home/user-profile/components/my-information'
import ProfilePageLayout from './profile-page.layout.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      title: 'My information',
    },
    'fr-FR': {
      title: 'Mes informations',
    },
  },
})
</script>

