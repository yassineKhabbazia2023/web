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
        :currentSubscriptionOffer
        :principalContacts="subscriptionDetails?.clients"
      />
      <CollaboratorsDetails
        v-if="activeTab === RecapTabs.COLLABORATORS"
        :collaborators="subscriptionDetails?.collaborators"
        :collaboratorRoles="collaboratorRoles"
      />
      <InformationDetails
        v-if="activeTab === RecapTabs.INFORMATION"
        :subscriptionOfferDetails="subscriptionDetails?.offer"
        :hasNoSiren="subscriptionDetails?.hasNoSiren"
        :accountId="subscriptionDetails.account.accountId"
        :pageContext="pageContext"
      />
      <StepNote
        v-if="hasNote"
        :modelValue="notes[noteIndex]"
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
import { RecapTabs, SubscriptionDetailsContext } from '@entities/modules/wallet/enums'
import type { Note } from '@entities/services/subscription/subscriptionTypes'
import type {
  SubscriptionDetailsTabsProps,
  SubscriptionDetailsTab,
} from './SubscriptionDetailsTabsTypes'
import StepNote from '@entities/components/StepNote'
import ServicesDetails from './components/ServicesDetails'
import CustomersDetails from '@entities/components/CustomersDetails'
import CollaboratorsDetails from './components/CollaboratorsDetails'
import InformationDetails from './components/InformationDetails'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      services: 'Services',
      customerUsers: 'Customer Users',
      collaborators: 'RYDGE Conseil Collaborators',
      information: 'Information',
    },
    'fr-FR': {
      services: 'Services',
      customerUsers: 'Utilisateurs Clients',
      collaborators: 'Collaborateurs RYDGE Conseil',
      information: 'Informations',
    },
  },
})

const props = defineProps<SubscriptionDetailsTabsProps>()

const notes = ref<Note[]>(props.subscriptionDetails?.notes ?? [])
const activeTab = ref<SubscriptionDetailsTab['name']>('services')
const pageContext = computed(() => props.pageContext ?? SubscriptionDetailsContext.DEFAULT)

const noteIndex = computed(() =>
  Object.values(RecapTabs).indexOf(activeTab.value as RecapTabs),
)
const hasNote = computed(() => {
  const note = notes.value?.[noteIndex.value]?.stepNote ?? ''

  return note.trim() !== ''
})

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

const collaboratorRoles = computed(() => props.currentSubscriptionOffer?.functions ?? [])
</script>

