<template>
  <p v-if="appVersion" class="app-version">
    v{{ appVersion }}
  </p>
</template>

<script setup lang="ts">
import { AppVersionManager } from '@pulse/core'

const appVersion = AppVersionManager.getMonorepoVersion()
</script>

<style lang="scss" scoped>
.app-version {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5px;
  color: white;
  opacity: 0.25;
  font-size: 1.1rem;
}
</style>
