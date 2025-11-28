<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from 'vue-router'
import { CollaboratorAnonymousFlowManager } from '@collaborator/managers/collaborator.anonymous.flow.manager'

onBeforeRouteLeave(() => {
  CollaboratorAnonymousFlowManager.exitAnonymousFlow()
})
</script>
