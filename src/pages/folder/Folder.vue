<template>
  <div>
    <div class="flex flex--align-items-center">
      <PAvatar pColor="orange">
        <PIcon>
          <PIPulse />
        </PIcon>
      </PAvatar>
      <p class="font-semibold margin-left--4 title">
        {{ user?.entities.default?.name }}
      </p>
      <PButton pType="primary">
        {{ t('delegationBtn') }}
      </PButton>
    </div>
    <PTabs v-model="activeTab" @tab-click="handleTabClick">
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
import { storeToRefs } from 'pinia'
import { commonStore } from '@kpmg/common'
import {
  PTabs,
  PTabPane,
  PAvatar,
  PIcon,
  PIPulse,
  PButton
} from '@kpmg/styleguide'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const activeTab = ref('users')
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const userStore = commonStore()
const { user } = storeToRefs(userStore)
const router = useRouter()
const tabs = [
  {
    name: 'users',
    trad: t('users')
  },
  {
    name: 'collab',
    trad: t('collab')
  },
  {
    name: 'offers',
    trad: t('offers')
  },
  {
    name: 'info',
    trad: t('info')
  },
  {
    name: 'history',
    trad: t('history')
  }
]

const handleTabClick = (tab: any) => {
  router.push({ name: tab.paneName, params: { name: user.value?.entities.default?.name } })
}

</script>

<style lang="scss" scoped>
.title {
  flex-grow: 2;
}
</style>

<i18n lang="yaml">
  en-US:
    users: 'Users'
    collab: 'Collaborator'
    offers: 'Offer'
    info: 'Information'
    history: 'History'
    delegationBtn: 'Delegate this case'
  fr-FR:
    users: 'Utilisateurs'
    collab: 'Collaborateur'
    offers: 'Offres'
    info: 'Information'
    history: 'Historique'
    delegationBtn: 'Déléguer ce dossier'
</i18n>
