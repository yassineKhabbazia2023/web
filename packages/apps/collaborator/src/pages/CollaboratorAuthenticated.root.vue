<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { CollaboratorAuthenticatedFlowManager } from '@collaborator/managers/collaborator.authenticated.flow.manager'
import { useLoadingStore } from '@pulse/common/stores'

const loadingStore = useLoadingStore()

onMounted(() => {
  loadingStore.stopGlobalLoading()
})

onBeforeRouteLeave(() => {
  CollaboratorAuthenticatedFlowManager.exitAuthenticatedFlow()
})
</script>
