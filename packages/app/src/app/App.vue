<template>
  <Suspense>
    <PConfigProvider>
      <component :is="currentLayout" />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch, onMounted } from 'vue'
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

const currentLayout = ref()
const currentLayoutName = ref<Layout>(Layout.EMPTY)
const previousLayoutName = ref<Layout>(Layout.EMPTY)

// #region layout management
function onRouteChange() {
  updateLayout()
}

function updateLayout() {
  const routeLayoutName = route.meta[LAYOUT_META]
  currentLayoutName.value = routeLayoutName || Layout.EMPTY

  if (previousLayoutName.value !== currentLayoutName.value) {
    currentLayout.value = markRaw(defineAsyncComponent(
      () => import(`@shared/layouts/${currentLayoutName.value}/index.ts`),
    ))
    previousLayoutName.value = currentLayoutName.value
  }
}

function currentLayoutIsLoginLayout() {
  return currentLayoutName.value === Layout.LOGIN
}
// #endregion

// #region 401
async function unauthorizedCallback() {
  CurrentUserManager.persistToken('')

  // logout user everywhere but the login layout
  if (currentLayoutIsLoginLayout() === false) {
    await logoutAndRedirectToLogin({ sessionExpired: 'true' })
  }
}
// #endregion

onMounted(() => {
  HTMLService.setDocumentTitle()
  // handle authorization
  CurrentUserManager.initToken()
  setUnauthorizedCallback(unauthorizedCallback)
  // handle layout
  updateLayout()
})

watch(
  () => route.name,
  () => onRouteChange(),
)
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.loader {
  height: calc(100vh - 270px);
}
</style>
