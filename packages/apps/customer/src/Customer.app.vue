<template>
  <Suspense>
    <PConfigProvider>
      <FullPageLoader v-show="isGlobalLoading === true" />
      <component :is="currentExperience" v-show="isGlobalLoading === false" />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { HTMLService } from '@pulse/common/services/html'
import { useRoute, useRouter } from 'vue-router'
import { PConfigProvider } from '@pulse/styleguide/components'
import { useLoadingStore } from '@pulse/common/stores'
import { LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { FullPageLoader } from '@pulse/shared/components'
import { CustomerAuthService } from './services/customer.auth.service'

const route = useRoute()
const loadingStore = useLoadingStore()

const isGlobalLoading = computed(() => loadingStore.isGlobalLoading)
const router = useRouter()

// #region experience loading
const HomeExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/customer-home.experience.vue'))
const LoginExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/customer-login.experience.vue'))
const ErrorExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/customer-error.experience.vue'))
const EmptyExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/customer-empty.experience.vue'))

const currentLayout = computed<Layout>(() => route.meta[LAYOUT_META] || Layout.EMPTY)

const currentExperience = computed(() => {
  switch (currentLayout.value) {
    case Layout.MAIN:
      return HomeExperienceAsyncComponent
    case Layout.LOGIN:
      return LoginExperienceAsyncComponent
    case Layout.ERROR:
      return ErrorExperienceAsyncComponent
    default:
      return EmptyExperienceAsyncComponent
  }
})
// #endregion

onMounted(() => {
  HTMLService.setDocumentTitle()
  CustomerAuthService.init(router, currentLayout)
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.loader {
  height: calc(100vh - 270px);
}
</style>
