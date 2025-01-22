<template>
  <div class="wrapperLogin text-left">
    <h4 class="title font--bold">
      {{ t('welcomeTo') }}<br>
      <span class="title__second-part"> {{ t('collaboratorSpace') }}</span>
    </h4>
    <p class="formTitle margin-top--3 margin-bottom--7">
      {{ t('formTitle') }}
    </p>
    <div class="flex flex--justify-content-center">
      <PSkewedButton
        :pContent="t('login')"
        pType="primary"
        data-testid="login-collab-button"
        @click="handleLoginCollab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PSkewedButton } from '@pulse/styleguide/components'
import { msalInstance } from '@login/services/msal'
import useInitAuth from '@login/composable/useInitUserAuth'
import { amplitudeService } from '@pulse/common'
import useNavigation from '@login/composable/useNavigation'

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
  margin-top: 16px;
  margin-bottom: 16px;
  @media (min-width: 992px) {
    margin-top: 20%;
  }
}
.title {
  font-size: 3.2rem;

  &__second-part {
    color: var(--el-color-primary);
  }
}

p {
  white-space: pre-line;
}

.formTitle {
  font-size: 1.6rem;
}
.button-wrapper {
  padding-top: 6px;
  margin-bottom: 0;
}
.buttonSubmit {
  width: 100%;
}
</style>

<!-- eslint-disable max-len -->
<i18n lang="json">
{
  "en-US": {
    "welcomeTo": "Welcome to your",
    "collaboratorSpace": "your collaborator space !",
    "login": "Login",
    "formTitle": "Welcome to your RYDGE Conseil platform.\n Please log in to access to all your services."
  },
  "fr-FR": {
    "welcomeTo": "Bienvenue sur votre",
    "collaboratorSpace": "espace collaborateur !",
    "login": "Se connecter",
    "formTitle": "Bienvenue sur votre plateforme RYDGE Conseil.\n Veuillez vous connecter pour accéder à tous vos\u202Fservices."
  }
}
</i18n>
