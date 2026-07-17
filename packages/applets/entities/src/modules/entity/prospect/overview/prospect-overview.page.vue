<template>
  <div class="entity-page">
    <header
      class="entity-wrapper"
      data-testid="prospect-tabs-wrapper"
    >
      <PEntityHeader
        v-if="currentEntity"
        :pLegalName="currentEntity.legalName"
        :pAccountNumber="currentEntity.accountNumber"
        :pAccountType="currentEntity.accountType"
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
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { PTabs, PTabPane, PEntityHeader } from '@pulse/styleguide/components'
import type { TabsPaneContext } from '@pulse/styleguide/types'
import { getProspectTabAuthorizations, getProspectTabs } from './prospect-overview.helper'
import type { ProspectTabName, ProspectTab } from './prospect-overview.type'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      users: 'Users',
      collab: 'Collaborators',
      info: 'Information',
    },
    'fr-FR': {
      users: 'Utilisateurs',
      collab: 'Collaborateurs',
      info: 'Informations',
    },
  },
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()
const activeTab = computed(() => route.name as ProspectTabName)

const { currentEntity } = storeToRefs(currentEntityStore)
const { isCollab } = storeToRefs(userStore)

const tabTitles = computed<Record<ProspectTabName, string>>(() => ({
  [RouteName.PROSPECT_USERS]: t('users'),
  [RouteName.PROSPECT_COLLAB]: t('collab'),
  [RouteName.PROSPECT_INFO]: t('info'),
}))

const tabAuthorizations = computed(() =>
  getProspectTabAuthorizations(isCollab.value ?? false),
)

const tabsList = computed<ProspectTab[]>(() => getProspectTabs(tabAuthorizations.value, tabTitles.value))

const navigateToDefaultTab = () => {
  const hasActiveTab = tabsList.value.some(tab => tab.name === activeTab.value)
  const firstAuthorizedTab = tabsList.value[0]
  if (firstAuthorizedTab === undefined) {
    return router.replace({ name: RouteName.PROSPECT_HOMEPAGE })
  }
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

watch(
  () => route.name,
  (routeName) => {
    if (routeName === RouteName.PROSPECT_OVERVIEW) {
      navigateToDefaultTab()
    }
  },
  { immediate: true },
)
</script>
