<template>
  <PDialog
    v-model="isVisibleDialog"
    pWidth='480px'
    pModal
    class="dialog-renew-token"
    :pCenter="false"
    :pTitle="t('title')"
  >
    <PImage
      pType="paupulse"
      pName="toggle"
      class="dialog-renew-token__popup-img"
    />
    <p class="p-dialog__text">
      {{ t('content') }}
    </p>
    <template #footer>
      <PButton
        pPlain
        pType="primary"
        pSize="small"
        :pRound="false"
        @click="handleLogout"
      >
        {{ t('logout') }}
      </PButton>
      <PButton
        pType="primary"
        pSize="small"
        :pRound="false"
        @click="handleRenew"
      >
        {{ t('renew') }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { PDialog, PButton, PImage } from '@kpmg/styleguide'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { commonApi, tokenService } from '@kpmg/common'
import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const isVisibleDialog = ref(false)
const emit = defineEmits(['logout'])
let exp: number | undefined
let sub: string | undefined
let timer: any

function onTokenChanges(token: string) {
  if (!token) return

  const decodedToken = jwtDecode<JwtPayload>(token)
  exp = decodedToken?.exp
  sub = decodedToken?.sub
  if (exp && sub) tokenHandle(exp)
}

const handleRenew = async () => {
  isVisibleDialog.value = false
  const baseUrl = `authentication/api/refreshToken?userId=${sub}`
  const { data: token } = await commonApi().gateway.post(baseUrl)
  tokenService.setToken(token)
  clearTimeout(timer)
}

const handleLogout = () => {
  isVisibleDialog.value = false
  emit('logout')
}

const tokenHandle = (exp: number) => {
  const delay = exp * 1000 - 5000 - Date.now()
  timer = setTimeout(() => {
    isVisibleDialog.value = true
  }, delay) // expiration time minus 5 seconds
}

onMounted(() => {
  tokenService.registerOnChange('popupcb', onTokenChanges)
})

onBeforeUnmount(() => {
  tokenService.unregisterOnChange('popupcb')
})
</script>

<style lang="scss">
.dialog-renew-token {
  &__popup-img > img {
    display: block;
    max-width: 221px;
    margin: auto;
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
      We will log you out in a few minutes unless you confirm that you are still on Pulse.
  fr-FR:
    title: 'Votre session va expirer'
    renew: 'Rester connecté'
    logout: 'Déconnexion'
    content: >-
      La confidentialité est essentielle, et vous êtes absent depuis un moment.
      Nous allons vous déconnecter dans quelques minutes sauf
      si vous confirmez que vous êtes toujours sur Pulse.'
</i18n>
