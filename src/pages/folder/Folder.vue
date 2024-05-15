<template>
  <div v-if="!isLoading" class="folder-wrapper">
    <div class="flex flex--align-items-center">
      <PAvatar pColor="orange">
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
      <p class="font-semibold margin-left--4 folder-wrapper__default-entity">
        {{ defaultEntity?.legalName }}
      </p>
      <PButton pType="primary" data-testid="folder-action-button">
        {{ actionButtonLabel }}
      </PButton>
    </div>
    <PTabs v-model="activeTab" @tab-click="handleTabClick">
      <PTabPane
        v-for="tab in tabsList"
        :key="tab.name"
        :pLabel="tab.title"
        :name="tab.name"
      />
      <router-view />
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
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
  PButton,
} from '@kpmg/styleguide'
import { PERMISSION_CODES } from '@/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Variables
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const userStore = commonStore()
const { hasPermission } = userPermissions()
const { defaultEntity, isCollab } = storeToRefs(userStore)

// Computed
const collabTabs = computed(() => [
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
  {
    name: 'delegationsHistory',
    title: t('delegationsHistory'),
    display: hasPermission(PERMISSION_CODES.HISTORY),
  },
])
const clientTabs = computed(() => [
  {
    name: 'usersClient',
    title: t('users'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_USERS),
  },
  {
    name: 'info',
    title: t('info'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_INFORMATION),
  },
  {
    name: 'invoices',
    title: t('invoices'),
    display: hasPermission(PERMISSION_CODES.ACCOUNT_INVOICES),
  },
])
const activeTab = computed(() => route.name as string)
const tabsList = computed(() => {
  const tabs = isCollab.value ? collabTabs.value : clientTabs.value
  return tabs.filter(({ display }) => display)
})
const actionButtonLabel = computed(() => {
  return isCollab.value ? t('delegationBtn') : t('addUser')
})

// Functions
const handleTabClick = (tab: any) => {
  router.push({
    name: tab.paneName,
    params: { name: defaultEntity.value?.legalName },
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
  delegationBtn: 'Delegate this case'
  invoices: 'KPMG Invoices'
  addUser: 'Add user'
fr-FR:
  users: 'Utilisateurs'
  collab: 'Collaborateurs'
  offers: 'Offres'
  info: 'Informations'
  delegationsHistory: 'Historique des délégations'
  delegationBtn: 'Déléguer ce dossier'
  invoices: 'Factures KPMG'
  addUser: 'Ajouter un utilisateur'
</i18n>
