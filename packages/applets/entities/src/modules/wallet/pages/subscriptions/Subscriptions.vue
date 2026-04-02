<template>
  <div class="margin-top--4">
    <SubscriptionStatusFilters
      v-model="activeStatusCodes"
      :offer-codes="offerCodes"
      :search="search"
      class="margin-bottom--6"
    />
    <SubscriptionsTable
      v-model:offerCodes="offerCodes"
      v-model:search="search"
      :active-status-codes="activeStatusCodes"
      @consult="onClickConsult"
    />
    <SubscriptionDetailsDrawer
      v-if="displaySubscriptionDrawer && selectedSubscriptionId"
      v-model="displaySubscriptionDrawer"
      :selected-subscription-id="selectedSubscriptionId"
      :page-context="SubscriptionDetailsContext.MOD_APPROVALS"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SubscriptionStatusFilters } from './components/SubscriptionStatusFilters'
import SubscriptionsTable from './components/SubscriptionsTable'
import SubscriptionDetailsDrawer from './components/SubscriptionDetailsDrawer'
import { SubscriptionDetailsContext } from '../../enums'
import { SubscriptionStatusFiltersManager } from './components/SubscriptionStatusFilters/subscription-status-filters.manager'
import type { SubscriptionStatusCode } from '@entities/services/subscription/subscriptionTypes'

const activeStatusCodes = ref<SubscriptionStatusCode[]>(SubscriptionStatusFiltersManager.getDefaultActiveStatusCodes())
const offerCodes = ref<string[]>([])
const search = ref<string>('')
const displaySubscriptionDrawer = ref<boolean>(false)
const selectedSubscriptionId = ref<number | undefined>(undefined)

const onClickConsult = (subscriptionId: number) => {
  selectedSubscriptionId.value = subscriptionId
  displaySubscriptionDrawer.value = true
}
</script>
