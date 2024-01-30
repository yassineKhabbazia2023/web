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
import {
  PTabs,
  PTabPane
} from '@kpmg/styleguide'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { commonStore } from '@kpmg/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const activeTab = ref('deploiment')
const router = useRouter()
const userStore = commonStore()

const collaboratorsTabs = [
  {
    name: 'deploiment',
    trad: t('deploiment')
  },
  {
    name: 'bank',
    trad: t('bank')
  },
  {
    name: 'admin',
    trad: t('admin')
  },
  {
    name: 'collaborators',
    trad: t('collaborators')
  }
]

const clientTabs = [
  {
    name: 'deploiment',
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
  deploiment: 'Deploiment'
  bank: 'Bank flow'
  admin: 'Administrator'
  collaborators: 'Collaborators'
  allEntities: 'All entities'
  allUsers: 'All users'
fr-FR:
  wallet: 'Portefeuille'
  deploiment: 'Déploiement'
  bank: 'Flux bancaires'
  admin: 'Administrateur'
  collaborators: 'Collaborateurs'
  allEntities: 'Toutes mes entités'
  allUsers: 'Tous les utilisateurs'
</i18n>
