<template>
  <div class="error-container">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { useLoadingStore } from '@pulse/common/stores'
import { onMounted } from 'vue'

const loadingStore = useLoadingStore()

onMounted(() => {
  // Whatever the error or the reason we end up here, we stop the global loading
  loadingStore.stopGlobalLoading()
})
</script>

<style scoped lang="scss">
.error-container {
  width: 100%;
  height: 100vh;
  overflow: auto;
}
</style>
