<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from 'vue-router'
import { CollaboratorAnonymousFlowManager } from '@collaborator/managers/collaborator.anonymous.flow.manager'

// onBeforeRouteLeave can fire multiple times when a child guard triggers a redirect
// (e.g. deepLinkGuard), because Vue Router cancels the navigation and starts a new one
// while this component is still mounted. Without this guard, the second call would
// stop third parties (like ProductFruits) that were already re-initialized for the authenticated flow.
let hasAnonymousFlowExited = false

onBeforeRouteLeave(() => {
  if (hasAnonymousFlowExited === true) {
    return
  }
  hasAnonymousFlowExited = true
  CollaboratorAnonymousFlowManager.exitAnonymousFlow()
})
</script>
