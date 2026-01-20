<template>
  <ProfilePageLayout
    footer-id="update-password__footer-drawer"
    :title="t('title')"
  >
    <UpdatePassword />
  </ProfilePageLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UpdatePassword from '@shared/layouts/home/user-profile/components/update-password'
import ProfilePageLayout from './profile-page.layout.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
en-US:
  title: 'Password'
fr-FR:
  title: 'Mot de passe'
</i18n>
