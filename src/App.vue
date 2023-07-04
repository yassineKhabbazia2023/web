<template>
  <component :is="getLayout" />
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  ref,
  markRaw,
  watch
} from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const getLayout = ref()

watch(() => route.name, () => {
  const layout = computed(() => route.meta?.layout || 'Home')

  getLayout.value = markRaw(defineAsyncComponent(() =>
    import(/* @vite-ignore */`@/layouts/${layout.value}/index.ts`)
  ))
})
</script>
