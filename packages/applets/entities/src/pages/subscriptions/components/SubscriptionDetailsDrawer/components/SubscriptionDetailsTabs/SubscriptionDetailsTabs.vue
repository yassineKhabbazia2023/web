<template>
  <PTabs v-model="activeTab" :pStretch="false">
    <PTabPane
      v-for="tab in subscriptionDetailsTabsList"
      :key="tab.name"
      :pLabel="tab.label"
      :pName="tab.name"
    />
    <div v-if="subscriptionDetails" class="margin-top--6">
      <ServicesDetails
        v-if="activeTab === RecapTabs.SERVICES"
        :subscriptionOfferDetails="subscriptionDetails?.offer"
      />
      <CustomersDetails
        v-if="activeTab === RecapTabs.CUSTOMER_USERS"
        :principalContacts="subscriptionDetails?.clients"
      />
      <CollaboratorsDetails
        v-if="activeTab === RecapTabs.COLLABORATORS"
        :collaborators="subscriptionDetails?.collaborators"
      />
      <InformationDetails
        v-if="activeTab === RecapTabs.INFORMATION"
        :subscriptionOfferDetails="subscriptionDetails?.offer"
        :accountId="subscriptionDetails.account.accountId"
      />
      <StepNote
        v-model="notes[noteIndex]"
        class="margin-top--6"
        disabled
      />
    </div>
  </PTabs>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PTabs, PTabPane } from '@pulse/styleguide/components'
import { RecapTabs } from './SubscriptionDetailsTabsTypes'
import type { Note } from '@entities/services/subscription'
import type {
  SubscriptionDetailsTabsProps,
  SubscriptionDetailsTab,
} from './SubscriptionDetailsTabsTypes'
import StepNote from '@entities/common/components/StepNote'
import ServicesDetails from './components/ServicesDetails'
import CustomersDetails from '@entities/common/components/CustomersDetails'
import CollaboratorsDetails from './components/CollaboratorsDetails'
import InformationDetails from './components/InformationDetails'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SubscriptionDetailsTabsProps>()

const notes = ref<Note[]>(props.subscriptionDetails?.notes ?? [])
const activeTab = ref<SubscriptionDetailsTab['name']>('services')

const noteIndex = computed(() =>
  Object.values(RecapTabs).indexOf(activeTab.value as RecapTabs),
)

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
    name: 'collaborators',
    label: t('collaborators'),
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
  collaborators: 'Rydge Conseil Collaborators'
  information: 'Information'
fr-FR:
  services: 'Services'
  customerUsers: 'Utilisateurs Clients'
  collaborators: 'Collaborateurs Rydge Conseil'
  information: 'Informations'
</i18n>
