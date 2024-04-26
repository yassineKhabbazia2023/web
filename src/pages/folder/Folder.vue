<template>
  <div class="folder-wrapper">
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
        :pLabel="tab.title"
        :name="tab.name"
        :key="tab.name"
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
import { commonStore } from '@kpmg/common'
import {
  PTabs,
  PTabPane,
  PAvatar,
  PIcon,
  PIPulse,
  PButton,
} from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Variables
const route = useRoute()
const router = useRouter()
const userStore = commonStore()
const { defaultEntity, isCollab } = storeToRefs(userStore)
const collabTabs = [
  {
    name: 'usersCollab',
    title: t('users'),
  },
  {
    name: 'collab',
    title: t('collab'),
  },
  {
    name: 'offers',
    title: t('offers'),
  },
  {
    name: 'info',
    title: t('info'),
  },
]

const clientTabs = [
  {
    name: 'usersClient',
    title: t('users'),
  },
  {
    name: 'info',
    title: t('info'),
  },
  {
    name: 'invoices',
    title: t('invoices'),
  },
]

// Computed
const activeTab = computed(() => route.name as string)
const tabsList = computed(() => {
  return isCollab.value ? collabTabs : clientTabs
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
  delegationBtn: 'Delegate this case'
  invoices: 'KPMG Invoices'
  addUser: 'Add user'
fr-FR:
  users: 'Utilisateurs'
  collab: 'Collaborateurs'
  offers: 'Offres'
  info: 'Informations'
  delegationBtn: 'Déléguer ce dossier'
  invoices: 'Factures KPMG'
  addUser: 'Ajouter un utilisateur'
</i18n>
