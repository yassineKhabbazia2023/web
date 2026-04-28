<template>
  <PConfigProvider>
    <FullPageLoader v-show="isGlobalLoading === true" />
    <component :is="currentExperience" v-show="isGlobalLoading === false" />
  </PConfigProvider>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { setUnauthorizedCallback } from '@pulse/common/unauthorized-callback'
import { CurrentUserManager } from '@pulse/common/managers'
import { HTMLService } from '@pulse/common/services/html'
import { useRoute, useRouter } from 'vue-router'
import { PConfigProvider } from '@pulse/styleguide/components'
import { useLoadingStore } from '@pulse/common/stores'
import { LAYOUT_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'
import { FullPageLoader } from '@pulse/shared/components'

const route = useRoute()
const router = useRouter()
const loadingStore = useLoadingStore()

const isGlobalLoading = computed(() => loadingStore.isGlobalLoading)

// #region experience loading
const HomeExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/collaborator-home.experience.vue'))
const LoginExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/collaborator-login.experience.vue'))
const ErrorExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/collaborator-error.experience.vue'))
const EmptyExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/collaborator-empty.experience.vue'))

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

// #region 401 handling
async function unauthorizedCallback() {
  CurrentUserManager.persistToken('')

  // logout user everywhere but the login layout
  if (currentLayout.value !== Layout.LOGIN) {
    router.replace({ name: RouteName.LOGIN_COLLAB, query: { sessionExpired: 'true' } })
  }
}
// #endregion

onMounted(() => {
  HTMLService.setDocumentTitle()
  CurrentUserManager.initToken()
  setUnauthorizedCallback(unauthorizedCallback)
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.loader {
  height: calc(100vh - 270px);
}
</style>
