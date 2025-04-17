<template>
  <div
    v-if="areTabsDisplayed"
    class="folder-wrapper"
    data-testid="folder-tabs-wrapper"
  >
    <EntityHeader
      v-if="selectedEntity"
      :legalName="selectedEntity.legalName"
      :accountNumber="selectedEntity.accountNumber"
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
  </div>
  <Home v-else-if="isHomeDisplayed" />
  <router-view />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { amplitudeService } from '@pulse/common'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'
import { PTabs, PTabPane } from '@pulse/styleguide/components'
import Home from './pages/home'
import { getTabAuthorisations, getTabs } from './FolderHelper'
import type { TabName, Tab } from './FolderTypes'
import EntityHeader from '@entities/common/components/EntityHeader'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Variables
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const selectedEntityStore = useSelectedEntityStore()
const activeTab = computed(() => route.name as string)

const { selectedEntity } = storeToRefs(selectedEntityStore)
const { isCollab } = storeToRefs(userStore)

// Computed
const tabTitles: Record<TabName, string> = {
  offers: t('offers'),
  info: t('info'),
  users: t('users'),
  collab: t('collab'),
  delegationsHistory: t('delegationsHistory'),
}
const tabAuthorisations = computed(() => getTabAuthorisations(isCollab.value ?? false))

const tabsList = computed<Tab[]>(() => getTabs(tabAuthorisations.value, tabTitles))

const NO_TABS = ['reports', 'folder']
const areTabsDisplayed = computed(
  () => !NO_TABS.includes(route.name as string),
)
const isHomeDisplayed = computed(() => route.name === 'folder')

// Functions
const handleTabClick = (tab: any) => {
  amplitudeService.track('Feature Consulted', {
    feature_name: tab.props.label.toLowerCase(),
  })
  router.push({
    name: tab.paneName,
  })
}
</script>

<style lang="scss" scoped>
.folder-wrapper {
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
  delegationsHistory: 'Delegations history'
fr-FR:
  users: 'Utilisateurs'
  collab: 'Collaborateurs'
  offers: 'Offres'
  info: 'Informations'
  delegationsHistory: 'Historique des délégations'
</i18n>
