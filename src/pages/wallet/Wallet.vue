<template>
  <div class="wallet padding--2">
    <h3 class="h3 margin-bottom--6 wallet__title">
      {{ t('wallet') }}
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
      >
        <router-view />
      </PTabPane>
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import {
  PTabs,
  PTabPane
} from '@kpmg/styleguide'
import { computed } from 'vue'
import { commonStore } from '@kpmg/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const route = useRoute()
const activeTab = computed(() => route.name as string)
const router = useRouter()
const userStore = commonStore()

const collaboratorsTabs = [
  {
    name: 'folders',
    trad: t('folders')
  },
  {
    name: 'folderMandats',
    trad: t('mandate')
  },
  {
    name: 'subscriptions',
    trad: t('subscriptions')
  },
  {
    name: 'collaborators',
    trad: t('collaborators')
  },
  {
    name: 'history',
    trad: t('history')
  }
]

const clientTabs = [
  {
    name: 'folders',
    trad: t('allEntities')
  },
  {
    name: 'allUsers',
    trad: t('allUsers')
  }
]

const tabs = userStore.isCollab ? collaboratorsTabs : clientTabs

const handleTabClick = (tab: any) => {
  router.push({ name: tab.paneName })
}
</script>

<i18n lang="yaml">
en-US:
  wallet: 'Wallet'
  folders: 'Folders'
  mandate: 'Mandate'
  subscriptions: 'Validate demand'
  history: 'History'
  collaborators: 'Collaborators'
  allEntities: 'All entities'
  allUsers: 'All users'
fr-FR:
  wallet: 'Portefeuille'
  folders: 'Dossiers'
  mandate: 'Mandat'
  subscriptions: 'Validation de la demande'
  history: 'Historique'
  collaborators: 'Collaborateurs'
  allEntities: 'Toutes mes entités'
  allUsers: 'Tous les utilisateurs'
</i18n>
