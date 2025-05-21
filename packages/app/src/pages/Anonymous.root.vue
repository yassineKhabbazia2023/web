<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount } from 'vue'
import { AnonymousFlowManager } from '@app/managers/anonymous.flow.manager'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { ROUTE_IS_COLLAB_META, APP_ROUTES } from '@pulse/common/constants'

const router = useRouter()
const route = useRoute()

const checkRedirections = (currentRoute: any) => { // TODO type // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47376
  if(currentRoute.name === APP_ROUTES.anonymous.name) {
    const nextRoute = AnonymousFlowManager.getLandingPage()
    router.push(nextRoute as any) // TODO type // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47376
  }
}

onBeforeMount(async () => {
  const routeIsCollab = route.meta[ROUTE_IS_COLLAB_META] === true
  AnonymousFlowManager.enterAnonymousFlow({ routeIsCollab })

  // check if we should redirect on first mount
  checkRedirections(route)
})

onBeforeRouteUpdate(async (to) => {
  // check if we should redirect on route update
  checkRedirections(to)
})


onBeforeUnmount(() => {
  AnonymousFlowManager.exitAnonymousFlow()
})
</script>
