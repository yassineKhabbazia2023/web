<template>
  <div class="margin-top--4">
    <SubscriptionsTable @consult="onClickConsult" />
    <SubscriptionDetailsDrawer
      v-if="displaySubscriptionDrawer && subscriptionAccount"
      v-model="displaySubscriptionDrawer"
      :account="subscriptionAccount"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SubscriptionAccount } from '@/services/subscription'
import SubscriptionsTable from './components/subscriptionsTable'
import SubscriptionDetailsDrawer from './components/SubscriptionDetailsDrawer'

const displaySubscriptionDrawer = ref<boolean>(false)
const subscriptionAccount = ref<SubscriptionAccount | undefined>(undefined)

const onClickConsult = (account: SubscriptionAccount) => {
  subscriptionAccount.value = account
  displaySubscriptionDrawer.value = true
}
</script>
