<template>
  <Suspense>
    <PConfigProvider>
      <Pulse />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { PConfigProvider } from '@kpmg/styleguide'
import Pulse from './views/Pulse.vue'
</script>
