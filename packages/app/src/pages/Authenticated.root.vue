<template>
  <FullPageLoader v-if="isLoading === true" />
  <router-view v-if="isLoading === false" />
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { logger } from '@pulse/core'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import type { RouteLocationNormalizedGeneric } from 'vue-router'
import FullPageLoader from '@app/components/FullPageLoader/FullPageLoader.vue'

const isLoading = ref(true)

const router = useRouter()
const route = useRoute()

const checkRedirections = async (currentRoute: RouteLocationNormalizedGeneric) => {
  const cguRedirection = await AuthenticatedFlowManager.getCGURedirection()
  if(cguRedirection && currentRoute.name !== cguRedirection.name) {
    return router.push(cguRedirection)
  }

  if(AuthenticatedFlowManager.isNavigatingToAuthenticatedRoot(currentRoute.name as string)) {
    const redirection = AuthenticatedFlowManager.getLandingPage()

    if(redirection && currentRoute.name !== redirection.name) {
      return router.push(redirection)
    }
  }

  if(AuthenticatedFlowManager.isNavigatingToCustomerWallet(currentRoute.name as string)) {
    const redirection = AuthenticatedFlowManager.getCustomerLandingPage()

    if(redirection && currentRoute.name !== redirection.name) {
      return router.push(redirection)
    }
  }
}

onBeforeMount(async () => {
  try {
    isLoading.value = true
    await AuthenticatedFlowManager.enterAuthenticatedFlow()
    // check if we should redirect on first mount
    await checkRedirections(route)
  } catch (error) {
    logger.error('Error while entering authenticated flow', error)
  } finally {
    isLoading.value = false
  }
})

onBeforeRouteUpdate(async (to) => {
  // check if we should redirect on route update
  await checkRedirections(to)
})

onBeforeUnmount(() => {
  AuthenticatedFlowManager.exitAuthenticatedFlow()
})
</script>
