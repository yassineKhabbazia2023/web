<template>
  <div
    v-if="areTabsDisplayed"
    class="folder-wrapper"
    data-testid="folder-tabs-wrapper"
  >
    <div class="flex flex--align-items-center">
      <PAvatar pColor="orange">
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
      <p class="margin-left--3 folder-wrapper__default-entity h4">
        {{ defaultEntity?.legalName }}
      </p>
    </div>
    <PTabs
      v-if="!isLoading"
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
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { amplitudeService, commonStore } from '@pulse/common'
import {
  PTabs,
  PTabPane,
  PAvatar,
  PIcon,
  PIPulse,
} from '@pulse/styleguide'
import Home from './pages/home'
import { getTabAuthorisations, getTabs } from './FolderHelper'
import type { TabName, Tab } from './FolderTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Variables
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const userStore = commonStore()
const activeTab = computed(() => route.name as string)
const { defaultEntity, isCollab } = storeToRefs(userStore)

// Computed
const tabTitles: Record<TabName, string> = {
  offers: t('offers'),
  info: t('info'),
  users: t('users'),
  collab: t('collab'),
  delegationsHistory: t('delegationsHistory'),
}
const tabAuthorisations = computed(() => getTabAuthorisations(isCollab.value))

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

// Hooks
onMounted(async () => {
  isLoading.value = true
  await userStore.fetchUserAccountPermissions()
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.folder-wrapper {
  &__default-entity {
    flex-grow: 2;
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
