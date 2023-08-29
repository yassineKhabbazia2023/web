<template>
  {{ aa }}
  <Suspense>
    <PConfigProvider>
      <component :is="getLayout" />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { PConfigProvider } from '@kpmg/styleguide'
import { defineAsyncComponent, ref, markRaw, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const getLayout = ref()
let previousLayout: string = ''
watch(
  () => route.name,
  () => {
    const layout = route.meta?.layout || 'Home'
    if (previousLayout !== layout) {
      getLayout.value = markRaw(
        defineAsyncComponent(
          () => import(`@/layouts/${layout}/index.ts`)
        )
      )
      previousLayout = layout.toString()
    }
  }
)

const aa = 'aaaAAAA'
</script>
