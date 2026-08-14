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
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { RouteName } from '@pulse/common/enums'
import { useUserStore, useCurrentEntityStore, useInvoicesAccessStore } from '@pulse/common/stores'
import { PTabs, PTabPane, PEntityHeader } from '@pulse/styleguide/components'
import type { TabsPaneContext } from '@pulse/styleguide/types'
import { getTabAuthorizations, getTabs } from './helpers/entity-overview.helper'
import type { TabName, Tab } from './types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      users: 'Users',
      collab: 'Collaborators',
      offers: 'Offers',
      info: 'Information',
      invoices: 'RYDGE Conseil invoices',
      history: 'Folder history',
    },
    'fr-FR': {
      users: 'Utilisateurs',
      collab: 'Collaborateurs',
      offers: 'Offres',
      info: 'Informations',
      invoices: 'Factures RYDGE Conseil',
      history: 'Historique du dossier',
    },
  },
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
}
const tabAuthorizations = computed(() =>
  getTabAuthorizations(
    isCollab.value ?? false,
    isTabVisible.value,
  ),
)

const tabsList = computed<Tab[]>(() => getTabs(tabAuthorizations.value, tabTitles))

const navigateToDefaultTab = () => {
  const hasActiveTab = tabsList.value.some(tab => tab.name === activeTab.value)
  const firstAuthorizedTab = tabsList.value[0]
  if (firstAuthorizedTab === undefined) {
    // if there is no tab in the list of authorized tabs
    // we redirect to entity redirect page
    return router.replace({ name: RouteName.ENTITY_REDIRECT })
  }
  // if there is no active tabs
  // we redirect to the first authorized tab
  if (hasActiveTab === false) {
    return router.replace({ name: firstAuthorizedTab.name })
  }
}

const handleTabClick = (tab: TabsPaneContext) => {
  const clickedTab = tabsList.value.find(t => t.name === tab.paneName)
  if (clickedTab) {
    AmplitudeService.track('Feature Consulted', {
      feature_name: clickedTab.title.toLowerCase(),
    })
    router.push({ name: clickedTab.name })
  }
}

// Runs on every route name change under this page (including direct URL access to a tab),
// not just when landing on ENTITY_OVERVIEW, so an unauthorized tab is never reachable directly.
watch(
  () => route.name,
  () => {
    navigateToDefaultTab()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.entity-wrapper {
  &__header-separator {
    width: 1px;
    height: 12px;
  }
}
</style>

