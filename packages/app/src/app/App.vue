<template>
  <Suspense>
    <PConfigProvider>
      <component :is="currentLayout" />
      <PopupRenewToken
        :isVisible="popupRenewTokenIsVisible"
        :isTokenExpired="isTokenExpired"
        :isCollab="isCollab ?? false"
        @close="onClosePopupRenewToken"
        @logout="onLogout"
        @renew-token="onRenewToken"
      />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { setIdle } from '@pulse/core/utils/idle'
import { VITE_IDLE_DURATION } from 'env-vars'
import {
  setUnauthorizedCallback,
  refreshClientToken,
} from '@pulse/common'
import { useUserStore, useTokenStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'
import { useRoute } from 'vue-router'
import { PConfigProvider } from '@pulse/styleguide/components'
import PopupRenewToken from '@app/components/PopupRenewToken'
import { storeToRefs } from 'pinia'
import { HTMLService, logger } from '@pulse/core'
import { useRedirection } from '@app/composables/useRedirection'
import { getExpirationDelays } from './app.utils'
import { LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

let openPopup5MinBeforeExpiredTimer: undefined | ReturnType<typeof setTimeout>
let openPopupWhenHasExpiredTimer: undefined | ReturnType<typeof setTimeout>

const tokenStore = useTokenStore()
const route = useRoute()
const userStore = useUserStore()

const { logoutAndRedirectToLogin } = useRedirection()
const { user, isCollab } = storeToRefs(userStore)

const NO_POPUP_RENEW_TOKEN_LAYOUTS = [
  Layout.LOGIN,
  Layout.ERROR,
]

const currentLayout = ref()
const currentLayoutName = ref<Layout>(Layout.EMPTY)
const previousLayoutName = ref<Layout>(Layout.EMPTY)
const popupRenewTokenIsVisible = ref(false)
const isTokenExpired = ref(false)

function getCanShowPopupRenewToken() {
  return !NO_POPUP_RENEW_TOKEN_LAYOUTS.includes(currentLayoutName.value)
}

function showPopupRenewToken() {
  if (getCanShowPopupRenewToken()) {
    popupRenewTokenIsVisible.value = true
  }
}

function onRouteChange() {
  const routeLayoutName = route.meta[LAYOUT_META]
  currentLayoutName.value = routeLayoutName || Layout.EMPTY

  if (popupRenewTokenIsVisible.value && !getCanShowPopupRenewToken()) {
    popupRenewTokenIsVisible.value = false
  }
  if (previousLayoutName.value !== currentLayoutName.value) {
    currentLayout.value = markRaw(defineAsyncComponent(
      () => import(`@app/layouts/${currentLayoutName.value}/index.ts`),
    ))
    previousLayoutName.value = currentLayoutName.value
  }
}
watch(
  () => route.name,
  () => onRouteChange(),
)

watch(
  user, () => {
    if (user.value) {
      setIdle(VITE_IDLE_DURATION, logoutAndRedirectToLogin)
    }
  },
)

async function unauthorizedCallback() {
  CurrentUserManager.persistToken('')
  isTokenExpired.value = true

  if (currentLayoutName.value === Layout.LOGIN) {
    return
  }

  if (!user.value) {
    logoutAndRedirectToLogin()

    return
  }
  showPopupRenewToken()
}

async function onClosePopupRenewToken() {
  popupRenewTokenIsVisible.value = false
}

async function onLogout() {
  popupRenewTokenIsVisible.value = false
  await logoutAndRedirectToLogin()
}

async function onRenewToken() {
  try {
    popupRenewTokenIsVisible.value = false
    const newToken = await refreshClientToken(tokenStore.tokenSub ?? '')
    CurrentUserManager.persistToken(newToken)
  } catch (error) {
    logger.error('Error renewing token:', error)
    // logout and redirect to login if the token renewal fails
    logoutAndRedirectToLogin()
  }
}

function setTimers(exp?: number) {
  clearTimersIfExist()
  const {
    expiredTokenDelay,
    openPopupDelay,
  } = getExpirationDelays(exp ?? 0)

  if (expiredTokenDelay > 0) {
    openPopupWhenHasExpiredTimer = setTimeout(() => {
      isTokenExpired.value = true
      showPopupRenewToken()
    }, expiredTokenDelay)
  }

  if (openPopupDelay > 0) {
    openPopup5MinBeforeExpiredTimer = setTimeout(() => {
      showPopupRenewToken()
    }, openPopupDelay)
  }
}

function clearTimersIfExist() {
  if (openPopupWhenHasExpiredTimer) {
    clearTimeout(openPopupWhenHasExpiredTimer)
    openPopupWhenHasExpiredTimer = undefined
  }
  if (openPopup5MinBeforeExpiredTimer) {
    clearTimeout(openPopup5MinBeforeExpiredTimer)
    openPopup5MinBeforeExpiredTimer = undefined
  }
}

function onTokenChanges() {
  const isExpired = tokenStore.getIsTokenExpired()
  isTokenExpired.value = isExpired
  const hasValidAccessToken = !isExpired

  if (hasValidAccessToken) {
    popupRenewTokenIsVisible.value = false
  }
  if (hasValidAccessToken) {
    setTimers(tokenStore.tokenExp)
  } else {
    clearTimersIfExist()
  }
}

watch(() => tokenStore.tokenExp, () => onTokenChanges())

onMounted(() => {
  CurrentUserManager.initToken()
  setUnauthorizedCallback(unauthorizedCallback)

  HTMLService.setDocumentTitle()
  onRouteChange()
})

onBeforeUnmount(() => {
  clearTimersIfExist()
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.loader {
  height: calc(100vh - 270px);
}
</style>
