<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('profileSettings')"
    pDirection="ttb"
    pType="mini"
    class="user-profile-drawer"
    @close-drawer-button="isDrawerOpened = false"
  >
    <MyInformation />
    <template #footer>
      <div id="my-information__footer-drawer" />
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'
import MyInformation from './components/MyInformation'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isDrawerOpened = defineModel<boolean>('isDrawerOpened', { default: false })

</script>

<i18n lang="yaml">
en-US:
  profileSettings: 'Profile Settings'
fr-FR:
  profileSettings: 'Paramètres du profil'
</i18n>
