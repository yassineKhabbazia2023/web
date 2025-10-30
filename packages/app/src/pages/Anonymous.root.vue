<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import { AnonymousFlowManager } from '@app/managers/anonymous.flow.manager'

onBeforeUnmount(() => {
  AnonymousFlowManager.exitAnonymousFlow()
})
</script>
