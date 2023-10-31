<template>
  <PDialog
    v-model="isVisibleDialog"
    width='480px'
    modal
    class="dialog-renew-token"
    :center="false"
    :title="t('title')"
  >
    <PImage
      type="paupulse"
      name="mini-deconnexion"
      class="popup-img"
    />
    <p class="p-dialog__text">
      {{ t('content') }}
    </p>
    <template #footer>
      <PButton
        type="secondary"
        size="small"
        :round="false"
        @click="handleLogout"
      >
        {{ t('logout') }}
      </PButton>
      <PButton
        type="primary"
        size="small"
        :round="false"
        @click="handleRenew"
      >
        {{ t('renew') }}
      </PButton>
    </template>
  </PDialog>
</template>

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

<script setup lang="ts">
import { PDialog, PButton, PImage } from '@kpmg/styleguide'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { commonStore as useStore, commonApi } from '@kpmg/common'
import jwtDecode, { JwtPayload } from 'jwt-decode'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const isVisibleDialog = ref(false)
const store = useStore()
const emit = defineEmits(['logout'])
let exp: number | undefined
let sub: string | undefined
let timer: any

watch(
  () => store.user?.token,
  (token) => {
    !!token &&
    ({ exp, sub } = jwtDecode<JwtPayload>(token)) &&
    !!exp &&
    tokenHandle(exp)
  }
)

const handleRenew = async () => {
  isVisibleDialog.value = false
  const baseUrl = `/refreshToken?userId=${sub}`
  const { data: token } = await commonApi().auth.post(baseUrl)
  store.$patch({
    user: {
      token
    }
  })
  sessionStorage.setItem('token', token)
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
</script>

<style lang="scss">
.dialog-renew-token {
  .popup-img > img {
    display: block;
    max-width: 221px;
    margin: auto;
  }
}
</style>
