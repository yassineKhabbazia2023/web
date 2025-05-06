<template>
  <div class="wallet">
    <h3 class="h3 margin-bottom--6 wallet__title">
      {{ t('hello') }} {{ user?.firstName }}
    </h3>

    <PTabs :modelValue="activeTab" @tab-click="handleTabClick">
      <template v-for="tab in tabs" :key="tab.name">
        <PTabPane
          v-if="tab.display"
          :pLabel="tab.title"
          :name="tab.name"
          class="margin-bottom--6"
        />
      </template>
      <router-view />
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { PTabs, PTabPane } from '@pulse/styleguide/components'
import { amplitudeService } from '@pulse/common'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { PERMISSION_CODES } from '@entities/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { user, isCollab } = storeToRefs(userStore)

const activeTab = computed(() => route.name as string)
const getCollaboratorsTabs = () => [
  {
    name: 'folders',
    title: t('wallet'),
    display: true,
  },
  {
    name: 'folderMandats',
    title: t('mandate'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.MANDATE),
  },
  {
    name: 'powerbi',
    title: t('uploadPowerBIReport'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.POWERBI_REPORT),
  },
  {
    name: 'biReportsList',
    title: t('biReportsList'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.POWERBI_REPORT),
  },
  {
    name: 'subscriptions',
    title: t('subscriptions'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.SUBSCRIPTIONS),
  },
  {
    name: 'collaborators',
    title: t('collaborators'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.COLLABORATORS),
  },
  {
    name: 'folderLauncher',
    title: t('launcher'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.LAUNCHER),
  },
  {
    name: 'accountManagement',
    title: t('accountManagement'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.ACCOUNT_MANAGEMENT),
  },
]

const clientTabs = [
  {
    name: 'entity-client',
    title: t('allEntities'),
    display: true,
  },
  {
    name: 'allUsers',
    title: t('allUsers'),
    display: CurrentUserManager.hasPermission(PERMISSION_CODES.USERS),
  },
]

const tabs = computed(() => (isCollab.value ? getCollaboratorsTabs() : clientTabs))

const handleTabClick = (tab: any) => {
  amplitudeService.track('Feature Consulted', {
    feature_name: tab.props.label.toLowerCase(),
  })
  router.push({ name: tab.paneName })
}
</script>

<i18n lang="yaml">
en-US:
  wallet: 'Wallet'
  hello: 'Hello'
  mandate: 'Mandate'
  subscriptions: 'MOD requests'
  launcher: 'Applications'
  collaborators: 'Collaborators'
  allEntities: 'All entities'
  allUsers: 'All users'
  accountManagement: 'Folder administration'
  uploadPowerBIReport: 'Upload a BI report'
  biReportsList: 'BI Reports'
fr-FR:
  wallet: 'Portefeuille'
  hello: 'Bonjour'
  mandate: 'Mandat'
  subscriptions: 'Demandes MOD'
  launcher: 'Applications'
  collaborators: 'Collaborateurs'
  allEntities: 'Mes entités'
  allUsers: 'Tous les utilisateurs'
  accountManagement: 'Administration dossiers'
  uploadPowerBIReport: 'Déposer un rapport BI'
  biReportsList: 'Rapports BI'
</i18n>
