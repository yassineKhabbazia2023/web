<template>
  <FullPageLoader v-if="isLoading === true" />
  <router-view v-if="isLoading === false" />
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import FullPageLoader from '@app/components/FullPageLoader/FullPageLoader.vue'
import { useLoadingStore } from '@pulse/common/stores'

const loadingStore = useLoadingStore()

const isLoading = computed(() => loadingStore.isLoading)

onMounted(() => {
  // Stop loading started in beforeEnter hook
  // This ensures the loader is hidden once the component is mounted
  loadingStore.stopLoading()
})

onBeforeRouteLeave(() => {
  AuthenticatedFlowManager.exitAuthenticatedFlow()
})
</script>
