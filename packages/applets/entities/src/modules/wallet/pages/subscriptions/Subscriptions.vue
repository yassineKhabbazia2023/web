<template>
  <div class="margin-top--4">
    <SubscriptionStatusFilters v-model="activeStatusCodes" class="margin-bottom--4" />
    <SubscriptionsTable :activeStatusCodes="activeStatusCodes" @consult="onClickConsult" />
    <SubscriptionDetailsDrawer
      v-if="displaySubscriptionDrawer && selectedSubscriptionId"
      v-model="displaySubscriptionDrawer"
      :selectedSubscriptionId="selectedSubscriptionId"
      :pageContext="SubscriptionDetailsContext.MOD_APPROVALS"
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
const displaySubscriptionDrawer = ref<boolean>(false)
const selectedSubscriptionId = ref<number | undefined>(undefined)

const onClickConsult = (subscriptionId: number) => {
  selectedSubscriptionId.value = subscriptionId
  displaySubscriptionDrawer.value = true
}
</script>
