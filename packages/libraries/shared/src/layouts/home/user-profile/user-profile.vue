<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('profileSettings')"
    pDirection="ttb"
    pType="mini"
    class="user-profile-drawer"
    @close-drawer-button="isDrawerOpened = false"
  >
    <PTabs
      v-if="shouldShowTabs"
      v-model="activeTab"
      p-stretch
    >
      <PTabPane
        pName="information"
        :pLabel="t('tabInformation')"
      >
        <MyInformation />
      </PTabPane>
      <PTabPane
        v-if="hasPasswordTab"
        pName="password"
        :pLabel="t('tabPassword')"
      >
        <UpdatePassword />
      </PTabPane>
    </PTabs>
    <MyInformation v-else />

    <template #footer>
      <div
        v-show="shouldShowTabs ? activeTab === 'information' : true"
        id="my-information__footer-drawer"
      />
      <div
        v-show="shouldShowTabs && activeTab === 'password'"
        id="update-password__footer-drawer"
      />
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PTabs, PTabPane } from '@pulse/styleguide/components'
import MyInformation from './components/my-information'
import UpdatePassword from './components/update-password'
import { useUserStore } from '@pulse/common/stores'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const userStore = useUserStore()

const isDrawerOpened = defineModel<boolean>('isDrawerOpened', { default: false })
const activeTab = ref<string>('information')
const isCollab = computed(() => userStore.isCollab)
const hasPasswordTab = computed(() => isCollab.value === false)
const shouldShowTabs = computed(() => hasPasswordTab.value)
</script>

<i18n lang="yaml">
en-US:
  profileSettings: 'Profile Settings'
  tabInformation: 'My information'
  tabPassword: 'Password'
fr-FR:
  profileSettings: 'Paramètres du profil'
  tabInformation: 'Mes informations'
  tabPassword: 'Mot de passe'
</i18n>
