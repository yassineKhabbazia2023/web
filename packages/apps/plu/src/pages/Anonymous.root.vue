<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onBeforeRouteLeave } from 'vue-router'
import { AnonymousFlowManager } from '@app/managers/anonymous.flow.manager'

onBeforeRouteLeave(() => {
  AnonymousFlowManager.exitAnonymousFlow()
})
</script>
