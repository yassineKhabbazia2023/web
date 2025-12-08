<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from 'vue-router'
import { CustomerAnonymousFlowManager } from '@customer/managers/customer.anonymous.flow.manager'

onBeforeRouteLeave(() => {
  CustomerAnonymousFlowManager.exitAnonymousFlow()
})
</script>
