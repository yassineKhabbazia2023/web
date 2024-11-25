<template>
  <PDrawer
    v-model="drawerModel"
    :pTitle="t('profileSettings')"
    pDirection="ttb"
    pType="mini"
    appendToBody
    class="user-profile-drawer"
    @close-drawer-button="drawerModel = false"
  >
    <MyInformation />
    <template #footer />
  </PDrawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'
import type UserProfileProps from './UserProfileTypes'
import MyInformation from './components/MyInformation'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps<UserProfileProps>()

const drawerModel = computed({
  get: () => props.hasDrawerOpened,
  set: value => emit('update:modelValue', value),
})
</script>

<i18n lang="yaml">
en-US:
  profileSettings: 'Profile Settings'
fr-FR:
  profileSettings: 'Paramètres du profil'
</i18n>
