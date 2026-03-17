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
        :pContent="submitButtonContent"
        :pDisabled="isLoading"
        :pHasLoader="isLoading"
        pType="primary"
        data-testid="login-collab-button"
        @click="handleLoginCollab"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PSkewedButton } from '@pulse/styleguide/components'
import { MsalService } from '@pulse/common/services/msal'
import { logger } from '@pulse/toolbox'
import { LoginManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'

const router = useRouter()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      welcomeTo: 'Welcome to your',
      collaboratorSpace: 'your collaborator space !',
      login: 'Login',
      loading: 'Loading...',
      formTitle: 'Welcome to your RYDGE Conseil platform.\n Please log in to access to all your services.',
    },
    'fr-FR': {
      welcomeTo: 'Bienvenue sur votre',
      collaboratorSpace: 'espace collaborateur !',
      login: 'Se connecter',
      loading: 'Chargement en cours',
      formTitle: 'Bienvenue sur votre plateforme RYDGE Conseil.\n Veuillez vous connecter pour accéder à tous vos services.',
    },
  },
})

const isLoading = ref(false)
const submitButtonContent = computed(() => isLoading.value ? t('loading') : t('login'))

const handleLoginCollab = () => {
  isLoading.value = true
  MsalService.loginRedirect()
}

const handleMSALRedirectionAfterLogin = async () => {
  isLoading.value = true
  try {
    const successfullyAuth = await LoginManager.initAuthCollab()

    if (successfullyAuth) {
      return router.push({ name: RouteName.LANDING })
    }
  } catch (e) {
    logger.error(e)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // MSAL redirects to this page after SSO login
  // We need to handle the redirection and check if the user is successfully authenticated
  handleMSALRedirectionAfterLogin()
})
</script>

<style lang="scss">
.wrapperLogin .error .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--p-red-500) inset;
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
    color: var(--p-jungle-400);
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
