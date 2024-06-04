<template>
  <div v-if="areTabsDisplayed" class="folder-wrapper">
    <div class="flex flex--align-items-center">
      <PAvatar pColor="orange">
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
      <p class="margin-left--3 folder-wrapper__default-entity h4">
        {{ defaultEntity?.legalName }}
      </p>
      <div class="folder__teleported-content" />
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
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { commonStore, userPermissions } from '@kpmg/common'
import {
  PTabs,
  PTabPane,
  PAvatar,
  PIcon,
  PIPulse,
} from '@kpmg/styleguide'
import { PERMISSION_CODES } from '@/constants'
import Home from './pages/home'
import { type Tab } from './FolderTypes'

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
const { hasPermission } = userPermissions()
const { defaultEntity, isCollab } = storeToRefs(userStore)

// Computed
const commonTabs = computed<Tab[]>(() => [
  {
    name: 'offers',
    title: t('offers'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_OFFER),
  },
  {
    name: 'info',
    title: t('info'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_INFORMATION),
  },
])

const collabTabs = computed<Tab[]>(() => [
  {
    name: 'usersCollab',
    title: t('users'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_USERS),
  },
  {
    name: 'collab',
    title: t('collab'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_COLLABORATORS),
  },
  ...commonTabs.value,
  {
    name: 'delegationsHistory',
    title: t('delegationsHistory'),
    display: hasPermission(PERMISSION_CODES.HISTORY),
  },
])
const clientTabs = computed<Tab[]>(() => [
  {
    name: 'usersClient',
    title: t('users'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_USERS),
  },
  ...commonTabs.value,
])
const tabsList = computed<Tab[]>(() => {
  const tabs = isCollab.value ? collabTabs.value : clientTabs.value
  return tabs.filter(({ display }) => display)
})

const NO_TABS = ['reports', 'folder']
const areTabsDisplayed = computed(
  () => !NO_TABS.includes(route.name as string),
)
const isHomeDisplayed = computed(() => route.name === 'folder')

// Functions
const handleTabClick = (tab: any) => {
  router.push({
    name: tab.paneName,
  })
}

// TODO: usersCollab & usersClient have the same path, and usersCollab is loaded instead of
// usersClient, that s why there is this "trick" (redirectToUsersClientIfClient & watch) below,
// but, in the end, usersCollab & usersClient should, perhaps, be merged or managed in another way
const redirectToUsersClientIfClient = () => {
  if (route.name === 'usersCollab' && !isCollab.value) {
    router.push({
      name: 'usersClient',
      params: { id: defaultEntity.value?.accountId },
    })
  }
}

watch(route, () => {
  redirectToUsersClientIfClient()
})

// Hooks
onMounted(async () => {
  isLoading.value = true
  await userStore.fetchUserAccountPermissions()
  redirectToUsersClientIfClient()
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
