<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { useLoadingStore } from '@pulse/common/stores'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.stopGlobalLoading()
})

onBeforeRouteLeave(() => {
  AuthenticatedFlowManager.exitAuthenticatedFlow()
})
</script>
