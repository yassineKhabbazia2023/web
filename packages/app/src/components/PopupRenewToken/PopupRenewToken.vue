<template>
  <PDialog
    v-model="isVisibleInternal"
    pWidth="480px"
    pModal
    class="dialog-renew-token"
    :pCenter="false"
    :pTitle="t('title')"
    data-testid="renew-token-dialog"
  >
    <div class="dialog-renew-token__popup-img-wrapper">
      <PImage
        pType="portrait"
        pName="loader-duotone"
        class="dialog-renew-token__popup-img"
      />
    </div>
    <p class="p-dialog__text">
      {{ t('content') }}
    </p>
    <template #footer>
      <PButton
        pPlain
        pType="secondary"
        pSize="small"
        :pRound="false"
        data-testid="logout-button"
        @click="handleLogout"
      >
        {{ t('logout') }}
      </PButton>
      <PButton
        pType="primary"
        pSize="small"
        :pRound="false"
        data-testid="renew-token-button"
        @click="handleTokenRenewal"
      >
        {{ t('renew') }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import jwtDecode from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'
import { PDialog, PButton, PImage } from '@pulse/styleguide/components'
import { useRedirection } from '@app/composables/useRedirection'
import { commonApi, tokenService } from '@pulse/common'
import type { PopupRenewTokenProps } from './PopupRenewToken.types'

const ON_TOKEN_CHANGE_EVENT = 'on-token-change'
const FIVE_MINUTES_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

const props = defineProps<PopupRenewTokenProps>()

const emit = defineEmits<{
  'update:isVisible': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const exp = ref<number>()
const sub = ref<string>()
const openPopupTimer = ref<ReturnType<typeof setTimeout>>()
const closePopupTimer = ref<ReturnType<typeof setTimeout>>()

const isVisibleInternal = computed({
  get: () => props.isVisible,
  set: (isVisible: boolean) => emit('update:isVisible', isVisible),
})

const { logoutAndRedirectToLogin } = useRedirection()

function onTokenChanges(token: string) {
  if (!token) {
    return
  }

  const decodedToken = jwtDecode<JwtPayload>(token)
  exp.value = decodedToken?.exp
  sub.value = decodedToken?.sub
  setTimers(exp.value)
}

function setTimers(exp?: number) {
  clearTimersIfExist()
  if (!exp) {
    return
  }
  const nowTimeStamp = new Date().getTime()
  const expireTimeStamp = exp * 1000

  // will close when expires
  const closePopupDelay = expireTimeStamp - nowTimeStamp

  // will open 5 minutes before it expires
  const openPopupDelay = closePopupDelay - FIVE_MINUTES_MS

  if (closePopupDelay <= 0) {
    return
  }
  // closes the popup when token has expired
  closePopupTimer.value = setTimeout(() => {
    isVisibleInternal.value = false
    logoutAndRedirectToLogin()
  }, closePopupDelay)

  if (openPopupDelay <= 0) {
    return
  }
  // opens the popup 5 minutes before token expires
  openPopupTimer.value = setTimeout(() => {
    isVisibleInternal.value = true
  }, openPopupDelay)
}

function clearTimersIfExist() {
  if (closePopupTimer.value) {
    clearTimeout(closePopupTimer.value)
    closePopupTimer.value = undefined
  }
  if (openPopupTimer.value) {
    clearTimeout(openPopupTimer.value)
    openPopupTimer.value = undefined
  }
}

const handleTokenRenewal = async () => {
  const baseUrl = `authentication/api/refreshToken?userId=${sub.value}`
  isVisibleInternal.value = false

  const { data: token } = await commonApi().gateway.post(baseUrl)

  tokenService.setToken(token)
}

const handleLogout = async () => {
  isVisibleInternal.value = false
  await logoutAndRedirectToLogin()
}

onMounted(() => {
  tokenService.registerOnChange(ON_TOKEN_CHANGE_EVENT, onTokenChanges)
})

onBeforeUnmount(() => {
  tokenService.unregisterOnChange(ON_TOKEN_CHANGE_EVENT)
  clearTimersIfExist()
})
</script>

<style lang="scss" scoped>
.dialog-renew-token {
  &__popup-img-wrapper {
    padding-top: 25px;
    padding-bottom: 35px;
    display: flex;
    justify-content: center;
  }
  &__popup-img {
      display: block;
      width: 39px;
    }
}
</style>

<i18n lang="yaml">
  en-US:
    title: 'Your session will expire'
    renew: 'Stay connect'
    logout: 'Disconnect'
    content: >-
      Privacy is essential, and you've been away for a while.
      We will log you out in a few minutes unless you confirm that you are still on RYDGE Conseil.
  fr-FR:
    title: 'Votre session va expirer'
    renew: 'Rester connecté'
    logout: 'Déconnexion'
    content: >-
      La confidentialité est essentielle, et vous êtes absent depuis un moment.
      Nous allons vous déconnecter dans quelques minutes sauf
      si vous confirmez que vous êtes toujours sur RYDGE Conseil.
</i18n>
