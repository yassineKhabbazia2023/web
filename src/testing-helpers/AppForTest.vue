<template>
  <div>
    <ComponentForTest/>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const ComponentForTest = defineAsyncComponent(() => import('./ComponentForTest.vue'))
</script>
