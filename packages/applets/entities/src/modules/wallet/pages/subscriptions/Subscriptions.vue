<template>
  <div class="margin-top--4">
    <SubscriptionsTable @consult="onClickConsult" />
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
import SubscriptionsTable from './components/SubscriptionsTable'
import SubscriptionDetailsDrawer from './components/SubscriptionDetailsDrawer'
import { SubscriptionDetailsContext } from '../../enums'

const displaySubscriptionDrawer = ref<boolean>(false)
const selectedSubscriptionId = ref<number | undefined>(undefined)

const onClickConsult = (subscriptionId: number) => {
  selectedSubscriptionId.value = subscriptionId
  displaySubscriptionDrawer.value = true
}
</script>
