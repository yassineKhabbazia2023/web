<template>
  <div>
    <PTabs v-model="activeTab" :pStretch="false">
      <PTabPane
        v-for="tab in subscriptionDetailsTabs"
        :pLabel="tab.label"
        :pName="tab.name"
        :key="tab.name"
      />
    </PTabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTabs, PTabPane } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeTab = ref<string>('services')
const subscriptionDetailsTabs = [
  {
    name: 'services',
    label: t('services'),
  },
  {
    name: 'customerUsers',
    label: t('customerUsers'),
  },
  {
    name: 'kpmgCollaborators',
    label: t('kpmgCollaborators'),
  },
  {
    name: 'information',
    label: t('information'),
  },
]
</script>

<i18n lang="yaml">
en-US:
  services: 'Services'
  customerUsers: 'Customer Users'
  kpmgCollaborators: 'KPMG Collaborators'
  information: 'Information'
fr-FR:
  services: 'Services'
  customerUsers: 'Utilisateurs Clients'
  kpmgCollaborators: 'Collaborateurs KPMG'
  information: 'Informations'
</i18n>
