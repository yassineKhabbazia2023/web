<template>
  <Suspense>
    <PConfigProvider>
      <component :is="currentLayout" />
      <PopupRenewToken
        :isVisible="popupRenewTokenIsVisible"
        :isTokenExpired="isTokenExpired"
        :isCollab="isCollab"
        @close="onClosePopupRenewToken"
        @logout="onLogout"
        @renew-token="onRenewToken"
      />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Idle } from 'idlejs'
import { VITE_IDLE_DURATION, VITE_AMPLITUDE_API_KEY, VITE_AMPLITUDE_SERVER_URL } from 'env-vars'
import {
  commonStore as useStore,
  amplitudeService,
  tokenService,
  setUnauthorizedCallback,
  refreshClientToken,
} from '@pulse/common'
import { useRoute, useRouter } from 'vue-router'
import { PConfigProvider } from '@pulse/styleguide/components'
import PopupRenewToken from '@app/components/PopupRenewToken'
import { storeToRefs } from 'pinia'
import { HTMLService } from '@pulse/core'
import { LoginRouteName } from '@pulse/common/constants'
import { useRedirection } from '@app/composables/useRedirection'
import { getExpirationDelays } from './app.utils'
import { LAYOUTS } from '@app/constants/constants'

const ON_TOKEN_CHANGE_EVENT = 'on-token-change'

let openPopup5MinBeforeExpiredTimer: undefined | ReturnType<typeof setTimeout>
let openPopupWhenHasExpiredTimer: undefined | ReturnType<typeof setTimeout>

const route = useRoute()
const router = useRouter()
const store = useStore()
const { logoutAndRedirectToLogin } = useRedirection()
const { user, isCollab } = storeToRefs(useStore())

const NO_POPUP_RENEW_TOKEN_LAYOUTS = [
  LAYOUTS.LOGIN,
  LAYOUTS.ERROR,
]

const currentLayout = ref()
const currentLayoutName = ref('')
const previousLayoutName = ref('')
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
  // brute force way of getting sure we have a userId defined in Amplitude
  if(user.value && user.value.id !== undefined) {
    amplitudeService.setUserId(user.value.id.toString())
  }
  currentLayoutName.value = route.meta?.layout?.toString() || LAYOUTS.MAIN
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

const handleLogout = async () => {
  await store.logout(store.$state)
  router.push({ name: LoginRouteName.LOGIN_COLLAB })
}

watch(
  user, () => {
    if (user.value) {
      if(user.value.id !== undefined) {
        // if the userId is not defined, we don't want to set it in Amplitude
        // we will set it later when we have a valid userId
        amplitudeService.setUserId(user.value.id.toString())
      }
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

async function unauthorizedCallback() {
  tokenService.setToken('')
  isTokenExpired.value = true

  if (currentLayoutName.value === LAYOUTS.LOGIN) {
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
  popupRenewTokenIsVisible.value = false
  const sub = tokenService.getTokenSub() ?? ''
  await refreshClientToken(sub)
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
  const hasValidAccessToken = tokenService.hasValidAccessToken()
  if (hasValidAccessToken) {
    popupRenewTokenIsVisible.value = false
  }
  isTokenExpired.value = !hasValidAccessToken
  if (hasValidAccessToken) {
    setTimers(tokenService.getTokenExp())
  } else {
    clearTimersIfExist()
  }
}

onMounted(() => {
  tokenService.registerOnChange(ON_TOKEN_CHANGE_EVENT, onTokenChanges)
  tokenService.initToken() // force to load token if defined in localstorage
  setUnauthorizedCallback(unauthorizedCallback)
  if (VITE_AMPLITUDE_API_KEY) {
    amplitudeService.init(VITE_AMPLITUDE_API_KEY, VITE_AMPLITUDE_SERVER_URL || undefined)
  }
  HTMLService.setDocumentTitle()
  onRouteChange()
})

onBeforeUnmount(() => {
  tokenService.unregisterOnChange(ON_TOKEN_CHANGE_EVENT)
  clearTimersIfExist()
})
</script>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
.loader {
  height: calc(100vh - 270px);
}
</style>
