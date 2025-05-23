<template>
  <div class="wallet">
    <h3 class="h3 margin-bottom--6 wallet__title">
      {{ t('hello') }} {{ user?.firstName }}
    </h3>

    <PTabs
      :modelValue="activeTab"
      @tab-click="handleTabClick"
    >
      <PTabPane
        v-for="tab in tabs"
        :key="tab.name"
        :pLabel="tab.title"
        :name="tab.name"
        class="margin-bottom--6"
      />
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
import { getTabs } from './Wallet.utils'
import { WalletTab } from './Wallet.enums'
import { WALLET_TAB_ROUTES } from './Wallet.const'
import type { TabsPaneContext } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const { user, isCollab } = storeToRefs(userStore)

const activeTab = computed(() => route.name as string)

const tabLabels: Record<WalletTab, string> = {
  [WalletTab.ACCOUNT_MANAGEMENT]: t('accountManagement'),
  [WalletTab.ALL_USERS]: t('allUsers'),
  [WalletTab.BI_REPORTS_LIST]: t('biReportsList'),
  [WalletTab.COLLABORATORS]: t('collaborators'),
  [WalletTab.ENTITY_CLIENT]: t('allEntities'),
  [WalletTab.FOLDER_LAUNCHER]: t('launcher'),
  [WalletTab.FOLDER_MANDATES]: t('mandate'),
  [WalletTab.FOLDERS]: t('wallet'),
  [WalletTab.OFFERS_CATALOG]: t('offers-catalog'),
  [WalletTab.POWER_BI]: t('uploadPowerBIReport'),
  [WalletTab.SUBSCRIPTIONS]: t('subscriptions'),
}

const tabs = computed(() => getTabs(tabLabels, isCollab.value ?? false))

const handleTabClick = (tab: TabsPaneContext) => {
  const walletTab = tab.paneName as WalletTab
  const name = WALLET_TAB_ROUTES[walletTab]

  if (name !== undefined) {
    amplitudeService.track('Feature Consulted', {
      feature_name: tab.props.label.toLowerCase(),
    })
    router.push({ name })
  }
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
  offers-catalog: 'Offers catalog'
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
  offers-catalog: 'Catalogue des offres'
</i18n>
