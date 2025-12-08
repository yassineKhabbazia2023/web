<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { CustomerAuthenticatedFlowManager } from '@customer/managers/customer.authenticated.flow.manager'
import { useLoadingStore } from '@pulse/common/stores'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.stopGlobalLoading()
})

onBeforeRouteLeave(() => {
  CustomerAuthenticatedFlowManager.exitAuthenticatedFlow()
})
</script>
