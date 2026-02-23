<template>
  <div class="entity-page">
    <header
      class="entity-wrapper"
      data-testid="folder-tabs-wrapper"
    >
      <PEntityHeader
        v-if="currentEntity"
        :pLegalName="currentEntity.legalName"
        :pAccountNumber="currentEntity.accountNumber"
        class="margin-bottom--4"
      />
      <PTabs
        :modelValue="activeTab"
        @tab-click="handleTabClick"
      >
        <PTabPane
          v-for="tab in tabsList"
          :key="tab.name"
          :pLabel="tab.title"
          :name="tab.name"
        />
      </PTabs>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'
import { useUserStore, useCurrentEntityStore, useInvoicesAccessStore } from '@pulse/common/stores'
import { PTabs, PTabPane, PEntityHeader } from '@pulse/styleguide/components'
import { getTabAuthorizations, getTabs } from './entity-helper'
import type { TabName, Tab } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Variables
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()
const activeTab = computed(() => route.name as TabName)

const { currentEntity } = storeToRefs(currentEntityStore)
const { isCollab } = storeToRefs(userStore)

const invoicesAccessStore = useInvoicesAccessStore()
const { isTabVisible } = storeToRefs(invoicesAccessStore)

// Computed
const tabTitles: Record<TabName, string> = {
  [RouteName.OFFERS]: t('offers'),
  [RouteName.INFO]: t('info'),
  [RouteName.RYDGE_INVOICES]: t('invoices'),
  [RouteName.USERS]: t('users'),
  [RouteName.COLLAB]: t('collab'),
  [RouteName.FOLDER_HISTORY]: t('history'),
  [RouteName.DELEGATIONS_HISTORY]: t('delegationsHistory'),
}
const tabAuthorizations = computed(() =>
  getTabAuthorizations(
    isCollab.value ?? false,
    isTabVisible.value,
  ),
)

const tabsList = computed<Tab[]>(() => getTabs(tabAuthorizations.value, tabTitles))

// Functions
const handleTabClick = (tab: any) => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: tab.props.label.toLowerCase(),
  })
  router.push({
    name: tab.paneName,
  })
}
</script>

<style lang="scss" scoped>
.entity-wrapper {
  &__header-separator {
    width: 1px;
    height: 12px;
  }
}
</style>

<i18n lang="yaml">
en-US:
  users: 'Users'
  collab: 'Collaborators'
  offers: 'Offers'
  info: 'Information'
  invoices: 'RYDGE Conseil invoices'
  history: 'Folder history'
  delegationsHistory: 'Delegations history'
fr-FR:
  users: 'Utilisateurs'
  collab: 'Collaborateurs'
  offers: 'Offres'
  info: 'Informations'
  invoices: 'Factures RYDGE Conseil'
  history: 'Historique du dossier'
  delegationsHistory: 'Historique des délégations'
</i18n>
