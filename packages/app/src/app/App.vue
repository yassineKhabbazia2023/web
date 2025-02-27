<template>
  <Suspense>
    <PConfigProvider>
      <component :is="currentLayout" />
      <PopupRenewToken
        :isVisible="canDisplayRenewTokenModal && popupRenewTokenIsVisible"
        :isTokenExpired="isTokenExpired"
        :isCollab="isCollab"
        @update:is-visible="popupRenewTokenIsVisible = $event"
        @logout="onLogout"
        @renew-token="onRenewToken"
      />
    </PConfigProvider>
  </Suspense>
</template>

<script setup lang="ts">
import { defineAsyncComponent, markRaw, ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
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

const ON_TOKEN_CHANGE_EVENT = 'on-token-change'

let openPopup5MinBeforeExpiredTimer: undefined | ReturnType<typeof setTimeout>
let openPopupWhenHasExpiredTimer: undefined | ReturnType<typeof setTimeout>

const route = useRoute()
const router = useRouter()
const store = useStore()
const { logoutAndRedirectToLogin } = useRedirection()
const { user, isCollab } = storeToRefs(useStore())

const MAIN_LAYOUT = 'Home'
const LOGIN_LAYOUT = 'LoginLayout'
const ERROR_LAYOUT = 'Error'
const NO_POPUP_RENEW_TOKEN_LAYOUTS = [
  LOGIN_LAYOUT,
  ERROR_LAYOUT,
]

const currentLayout = ref()
const currentLayoutName = ref('')
const previousLayoutName = ref('')
const popupRenewTokenIsVisible = ref(false)
const isTokenExpired = ref(false)
const canDisplayRenewTokenModal = computed(() =>
  !NO_POPUP_RENEW_TOKEN_LAYOUTS.includes(currentLayoutName.value),
)

function initCurrentLayout() {
  currentLayoutName.value = route.meta?.layout?.toString() || MAIN_LAYOUT
  if (previousLayoutName.value !== currentLayoutName.value) {
    currentLayout.value = markRaw(defineAsyncComponent(
      () => import(`@app/layouts/${currentLayoutName.value}/index.ts`),
    ))
    previousLayoutName.value = currentLayoutName.value
  }
}
watch(
  () => route.name,
  () => initCurrentLayout(),
)

const handleLogout = async () => {
  await store.logout(store.$state)
  router.push({ name: LoginRouteName.LOGIN_COLLAB })
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

async function unauthorizedCallback() {
  tokenService.setToken('')
  isTokenExpired.value = true

  if (canDisplayRenewTokenModal.value) {
    if (!user.value) {
      logoutAndRedirectToLogin()

      return
    }
    popupRenewTokenIsVisible.value = true
  }
}

async function onLogout() {
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
      popupRenewTokenIsVisible.value = true
    }, expiredTokenDelay)
  }

  if (openPopupDelay > 0) {
    openPopup5MinBeforeExpiredTimer = setTimeout(() => {
      popupRenewTokenIsVisible.value = true
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
  isTokenExpired.value = !tokenService.hasValidAccessToken()
  setTimers(tokenService.getTokenExp())
}

onMounted(() => {
  tokenService.registerOnChange(ON_TOKEN_CHANGE_EVENT, onTokenChanges)
  setUnauthorizedCallback(unauthorizedCallback)
  if (VITE_AMPLITUDE_API_KEY) {
    amplitudeService.init(VITE_AMPLITUDE_API_KEY, VITE_AMPLITUDE_SERVER_URL || undefined)
  }
  HTMLService.setDocumentTitle()
  initCurrentLayout()
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
