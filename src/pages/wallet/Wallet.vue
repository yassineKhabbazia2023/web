<template>
  <div class="wallet padding--2">
    <h3 class="h3 margin-bottom--6 wallet__title">
      {{ t('hello') }} {{ user?.firstName }}
    </h3>

    <PTabs
      v-model="activeTab"
      @tab-click="handleTabClick"
    >
      <PTabPane
        v-for="tab in tabs"
        :pLabel="tab.trad"
        :name="tab.name"
        :key="tab.name"
      />
      <router-view />
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import {
  PTabs,
  PTabPane,
} from '@kpmg/styleguide'
import { computed } from 'vue'
import { commonStore } from '@kpmg/common'
import { storeToRefs } from 'pinia'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const route = useRoute()
const router = useRouter()
const { user, isCollab } = storeToRefs(commonStore())

const activeTab = computed(() => route.name as string)
const collaboratorsTabs = [
  {
    name: 'folders',
    trad: t('wallet'),
  },
  {
    name: 'folderMandats',
    trad: t('mandate'),
  },
  {
    name: 'subscriptions',
    trad: t('subscriptions'),
  },
  {
    name: 'collaborators',
    trad: t('collaborators'),
  },
  {
    name: 'history',
    trad: t('history'),
  },
]

const clientTabs = [
  {
    name: 'entity-client',
    trad: t('allEntities'),
  },
  {
    name: 'allUsers',
    trad: t('allUsers'),
  },
]

const tabs = computed(() => isCollab.value ? collaboratorsTabs : clientTabs)

const handleTabClick = (tab: any) => {
  router.push({ name: tab.paneName })
}
</script>

<i18n lang="yaml">
en-US:
  wallet: 'Wallet'
  hello: 'Hello'
  mandate: 'Mandate'
  subscriptions: 'MOD requests'
  history: 'History'
  collaborators: 'Collaborators'
  allEntities: 'All entities'
  allUsers: 'All users'
fr-FR:
  wallet: 'Portefeuille'
  hello: 'Bonjour'
  mandate: 'Mandat'
  subscriptions: 'Demandes MOD'
  history: 'Historique'
  collaborators: 'Collaborateurs'
  allEntities: 'Mes entités'
  allUsers: 'Tous les utilisateurs'
</i18n>
