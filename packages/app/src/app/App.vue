<template>
  <Suspense>
    <PConfigProvider>
      <component :is="getLayout" :illustration="illustration" />
      <PopupRenewToken />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch, onMounted } from 'vue'
import { Idle } from 'idlejs'
import { VITE_IDLE_DURATION, VITE_AMPLITUDE_API_KEY } from 'env-vars'
import { commonStore as useStore, amplitudeService } from '@pulse/common'
import { useRoute, useRouter } from 'vue-router'
import { PConfigProvider } from '@pulse/styleguide'
import PopupRenewToken from '@app/components/PopupRenewToken'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { user } = storeToRefs(useStore())
const getLayout = ref()
let previousLayout: string = ''
const illustration = ref()

watch(
  () => route.name,
  () => {
    const layout = (route.meta?.layout as string) || 'Home'
    illustration.value = route.meta?.illustration
    if (previousLayout !== layout) {
      getLayout.value = markRaw(defineAsyncComponent(
        () => import(`@app/layouts/${layout}/index.ts`),
      ))
      previousLayout = layout.toString()
    }
  },
)

const handleLogout = async () => {
  await store.logout(store.$state)
  router.push({ name: 'login' })
}

watch(
  user, () => {
    if (user.value) {
      amplitudeService.setUserId(user.value.id)
      new Idle()
        .whenNotInteractive()
        .within(VITE_IDLE_DURATION)
        .do(() => {
          handleLogout()
        })
        .start()
    }
  },
)

onMounted(() => {
  if (window.navigator.doNotTrack !== '1' && VITE_AMPLITUDE_API_KEY) {
    amplitudeService.init(VITE_AMPLITUDE_API_KEY)
  }
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.loader {
  height: calc(100vh - 270px);
}
</style>
