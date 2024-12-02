<template>
  <PDialog
    v-model="isVisibleDialog"
    pWidth="480px"
    pModal
    class="dialog-renew-token"
    :pCenter="false"
    :pTitle="t('title')"
    data-testid="renew-token-dialog"
  >
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import jwtDecode from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'
import { PDialog, PButton } from '@pulse/styleguide/components'
import { useRedirection } from '@app/composables/useRedirection'
import { commonApi, tokenService } from '@pulse/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

let exp: number | undefined
let sub: string | undefined
let timer: any
let redirectTimer: any
const isVisibleDialog = ref(false)
const { logoutAndRedirectToLogin } = useRedirection()

function onTokenChanges(token: string) {
  if (!token) {
    return
  }

  const decodedToken = jwtDecode<JwtPayload>(token)
  exp = decodedToken?.exp
  sub = decodedToken?.sub
  if (exp && sub) {
    tokenHandle(exp)
    handleRedirectAfterExpiration(exp)
  }
}

const handleTokenRenewal = async () => {
  const baseUrl = `authentication/api/refreshToken?userId=${sub}`
  const { data: token } = await commonApi().gateway.post(baseUrl)
  tokenService.setToken(token)
  isVisibleDialog.value = false
  clearTimeout(timer)
  clearTimeout(redirectTimer)
}

const handleLogout = async () => {
  await logoutAndRedirectToLogin()
  isVisibleDialog.value = false
}

const tokenHandle = (exp: number) => {
  const delay = exp * 1000 - 300000 - Date.now()
  timer = setTimeout(() => {
    isVisibleDialog.value = true
  }, delay) // Will display the popup 5 minutes before the token expires
}

function handleRedirectAfterExpiration(exp: number) {
  const delay = exp * 1000 - Date.now()

  redirectTimer = setTimeout(() => {
    isVisibleDialog.value = false
    logoutAndRedirectToLogin()
  }, delay)
}

onMounted(() => {
  tokenService.registerOnChange('popupcb', onTokenChanges)
})

onBeforeUnmount(() => {
  tokenService.unregisterOnChange('popupcb')
})
</script>

<i18n lang="yaml">
  en-US:
    title: 'Your session will expire'
    renew: 'Stay connect'
    logout: 'Disconnect'
    content: >-
      Privacy is essential, and you've been away for a while.
      We will log you out in a few minutes unless you confirm that you are still on Pulse.
  fr-FR:
    title: 'Votre session va expirer'
    renew: 'Rester connecté'
    logout: 'Déconnexion'
    content: >-
      La confidentialité est essentielle, et vous êtes absent depuis un moment.
      Nous allons vous déconnecter dans quelques minutes sauf
      si vous confirmez que vous êtes toujours sur Pulse.
</i18n>
