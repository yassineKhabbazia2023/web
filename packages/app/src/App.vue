<template>
  <Suspense>
    <PConfigProvider>
      <component :is="currentExperience" />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { computed, onMounted, defineAsyncComponent } from 'vue'
import { setUnauthorizedCallback } from '@pulse/common'
import { CurrentUserManager } from '@pulse/common/managers'
import { HTMLService } from '@pulse/common/services/html'
import { useRoute } from 'vue-router'
import { PConfigProvider } from '@pulse/styleguide/components'
import { useRedirection } from '@app/composables/useRedirection'
import { LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

const route = useRoute()
const { logoutAndRedirectToLogin } = useRedirection()

// #region experience loading
const HomeExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/app-home.experience.vue'))
const LoginExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/app-login.experience.vue'))
const ErrorExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/app-error.experience.vue'))
const EmptyExperienceAsyncComponent = defineAsyncComponent(() => import('./experiences/app-empty.experience.vue'))

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
    await logoutAndRedirectToLogin({ sessionExpired: 'true' })
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
