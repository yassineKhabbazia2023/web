<template>
  <PDialog
    :modelValue="isVisible"
    pWidth="420px"
    pModal
    class="dialog-renew-token"
    :pCenter="false"
    :pShowClose="false"
    data-testid="renew-token-dialog"
    :beforeClose="beforeCloseModalNoop"
  >
    <div class="flex flex--justify-content-center">
      <PImage
        pType="portrait"
        :pName="isTokenExpired ? 'power-duotone' : 'hourglass-duotone'"
        class="dialog-renew-token__popup-img"
      />
    </div>
    <div class="h3 p-dialog__title text-center margin-y--4">
      {{ t(`${statusKey}.title`) }}
    </div>
    <p class="p-dialog__text">
      {{ t(`${statusKey}.content.${isCollab ? 'collab' : 'client'}`) }}
    </p>
    <template #footer>
      <PButton
        v-if="!isTokenExpired"
        pPlain
        pType="secondary"
        pSize="small"
        data-testid="logout-button"
        @click="onClickFirstButton"
      >
        {{ t(`${statusKey}.logout.${isCollab ? 'collab' : 'client'}`) }}
      </PButton>
      <PButton
        pType="primary"
        pSize="small"
        data-testid="renew-token-button"
        @click="onClickSecondButton"
      >
        {{ t(`${statusKey}.renew.${isCollab ? 'collab' : 'client'}`) }}
      </PButton>
    </template>
  </PDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDialog, PButton, PImage } from '@pulse/styleguide/components'
import type { PopupRenewTokenProps } from './PopupRenewToken.types'

const props = defineProps<PopupRenewTokenProps>()

const emit = defineEmits<{
  'close': []
  'logout': []
  'renew-token': []
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const onClickFirstButton = () => {
  if (props.isCollab) {
    emit('close')
  } else {
    handleLogout()
  }
}

const onClickSecondButton = () => {
  if (props.isTokenExpired || props.isCollab) {
    handleLogout()
  } else {
    emit('renew-token')
  }
}

const handleLogout = () => {
  emit('logout')
}

const statusKey = computed(() => props.isTokenExpired
  ? 'disconnected'
  : 'connected',
)

function beforeCloseModalNoop() {
  // keep this code to prevent from closing dialog internaly
}
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
      width: 24px;
    }
}
</style>

<i18n lang="yaml">
  en-US:
    connected:
      title: 'Your session will expire soon'
      renew:
        client: 'Stay connect'
        collab: 'Reconnect'
      content:
        client: >-
            Privacy is important and you have been logged in for a while.
            We will log you out in a few minutes,
            unless you confirm that you are still on RYDGE Conseil.
        collab: >-
          You will be automatically logged out of the session in 5 minutes.
          We advise you to save your progress before logging back in.
      logout:
        client: 'Disconnect'
        collab: 'Continue'
    disconnected:
      title: 'Your session has expired'
      renew:
        client: 'Reconnect'
        collab: 'Reconnect'
      content:
        client: 'Please log in again to access the platform.'
        collab: 'Please log in again to access the platform.'
      logout:
        client: 'Disconnect'
        collab: 'Continue'
  fr-FR:
    connected:
      title: 'Votre session va bientôt expirer'
      renew:
        client: 'Rester connecté'
        collab: 'Se reconnecter'
      content:
        client: >-
          La confidentialité est essentielle et vous êtes connecté(e) depuis un moment.
          Nous allons vous déconnecter dans quelques minutes,
          sauf si vous confirmez que vous êtes toujours sur APP RYDGE Conseil.
        collab: >-
          Vous serez automatiquement déconnecté de la session dans 5 minutes.
          Nous vous conseillons de sauvegarder votre progression avant de vous reconnecter.
      logout:
        client: 'Déconnexion'
        collab: 'Continuer'
    disconnected:
      title: 'Votre session a expiré'
      renew:
        client: 'Se reconnecter'
        collab: 'Se reconnecter'
      content:
        client: 'Veuillez vous reconnecter pour accéder à la plateforme.'
        collab: 'Veuillez vous reconnecter pour accéder à la plateforme.'
      logout:
        client: 'Déconnexion'
        collab: 'Continuer'
</i18n>
