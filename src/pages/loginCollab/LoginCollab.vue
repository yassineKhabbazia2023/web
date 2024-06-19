<template>
  <div class="wrapperLogin">
    <h4 class="title">
      {{ t('Title') }}
    </h4>
    <p class="formTitle">
      {{ t('formTitle') }}
    </p>
    <PButton
      @click="handleLoginCollab"
      pType="primary"
      class="buttonSubmit"
      data-testid="login-button"
    >
      {{ t('login') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton } from '@kpmg/styleguide'
import { msalInstance } from '@/services/msal'
import useInitAuth from '@/composable/useInitUserAuth'
import { amplitudeService } from '@kpmg/common'
import useNavigation from '@/composable/useNavigation'

const { initAuthCollab, isTokenRetrieve } = useInitAuth()
const { navigateToWallet } = useNavigation()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const handleLoginCollab = () => {
  msalInstance.loginRedirect()
}

onMounted(async () => {
  amplitudeService.reset()
  await initAuthCollab()
  if (isTokenRetrieve.value) {
    navigateToWallet()
  }
})
</script>

<style lang="scss">
.wrapperLogin .error .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
</style>

<style lang="scss" scoped>
.wrapperLogin {
  margin-top: 20%;
  text-align: center;
}
.title {
  margin-bottom: 24px;
}
.formTitle {
  font-size: 1.6rem;
  margin-bottom: 18px;
}

.button-wrapper {
  padding-top: 6px;
  margin-bottom: 0;
}
.buttonSubmit {
  width: 100%;
}
</style>

<i18n lang="yaml">
en-US:
  Title: 'COLLABORATOR SPACE'
  login: 'Login'
  formTitle: >-
    Welcome to your KPMG Pulse platform. Please log in to access to all your services.
fr-FR:
  Title: 'ESPACE COLLABORATEUR'
  login: 'Se connecter'
  formTitle: >-
    Bienvenue sur votre plateforme KPMG Pulse. Veuillez vous connecter pour accéder
    à tous vos services.
</i18n>
