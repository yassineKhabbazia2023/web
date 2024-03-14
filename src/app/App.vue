<template>
  <Suspense>
    <PConfigProvider>
      <component :is="getLayout" />
      <PopupRenewToken @logout="handleLogout" />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch } from 'vue'
import { Idle } from 'idlejs'
import { VITE_IDLE_DURATION } from 'env-vars'
import { commonStore as useStore } from '@kpmg/common'
import { useRoute, useRouter } from 'vue-router'
import { PConfigProvider } from '@kpmg/styleguide'

const route = useRoute()
const router = useRouter()
const store = useStore()
const getLayout = ref()
let previousLayout: string = ''

watch(
  () => route.name,
  () => {
    const layout = (route.meta?.layout as string) || 'Home'
    if (previousLayout !== layout) {
      getLayout.value = markRaw(defineAsyncComponent(
        () => import(`@/layouts/${layout}/index.ts`),
      ))
      previousLayout = layout.toString()
    }
  },
)

const handleLogout = async () => {
  await store.logout(store.$state)
  router.push({ name: 'login' })
}

const idle = new Idle()
  .whenNotInteractive()
  .within(VITE_IDLE_DURATION)
  .do(async () => await handleLogout())
idle.start()
</script>
