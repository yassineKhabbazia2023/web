<template>
  <PTabs v-model="activeTab" :pStretch="false">
    <PTabPane
      v-for="tab in subscriptionDetailsTabsList"
      :pLabel="tab.label"
      :pName="tab.name"
      :key="tab.name"
    >
      <div v-if="subscriptionDetails" class="margin-top--6">
        <ServicesDetails
          v-if="activeTab === subscriptionDetailsTabsList[0].name"
          :subscriptionOfferDetails="subscriptionDetails?.offer"
        />
        <StepNote
          v-model="notes[tab.index]"
          class="margin-top--6"
          disabled
        />
      </div>
    </PTabPane>
  </PTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTabs, PTabPane } from '@kpmg/styleguide'
import type { Note } from '@/services/subscription'
import type { SubscriptionDetailsTabsProps, SubscriptionDetailsTab } from './SubscriptionDetailsTabsTypes'
import StepNote from '@/common/components/StepNote'
import ServicesDetails from './components/ServicesDetails'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SubscriptionDetailsTabsProps>()

const notes = ref<Note[]>(props.subscriptionDetails?.notes ?? [])
const activeTab = ref<SubscriptionDetailsTab['name']>('services')

const subscriptionDetailsTabsList: SubscriptionDetailsTab[] = [
  {
    index: 0,
    name: 'services',
    label: t('services'),
  },
  {
    index: 1,
    name: 'customerUsers',
    label: t('customerUsers'),
  },
  {
    index: 2,
    name: 'kpmgCollaborators',
    label: t('kpmgCollaborators'),
  },
  {
    index: 3,
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
