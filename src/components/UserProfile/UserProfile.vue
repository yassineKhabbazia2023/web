<template>
  <PDrawer
    @close-drawer-button="drawerModel = false"
    v-model="drawerModel"
    :pTitle="t('profileSettings')"
    pDirection="ttb"
    pType="mini"
    appendToBody
    class="user-profile-drawer"
  >
    <PTabs
      v-model="activeTab"
      pStretch
    >
      <PTabPane
        v-for="tab in TABS"
        :pLabel="tab.label"
        :name="tab.key"
        :key="tab.key"
      />
      <div class="margin-top--6">
        <MyInformation v-if="activeTab === TABS[0].key" />
      </div>
    </PTabs>
    <template #footer />
  </PDrawer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  PTabPane,
  PTabs,
} from '@kpmg/styleguide'
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

const TABS = [
  {
    key: 'myInformation',
    label: t('myInformation'),
  },
  {
    key: 'myAccessRights',
    label: t('myAccessRights'),
  },
]
const activeTab = ref(TABS[0].key)
</script>

<i18n lang="yaml">
en-US:
  profileSettings: 'Profile Settings'
  myInformation: 'My Information'
  myAccessRights: 'My access rights'
fr-FR:
  profileSettings: 'Paramètres du profil'
  myInformation: 'Mes informations'
  myAccessRights: "Mes droits d'accès"
</i18n>
