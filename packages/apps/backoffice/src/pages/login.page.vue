<template>
  <div
    class="
      flex
      flex--align-items-center
      flex--justify-content-center
      height--100vh
      bg--base-blue-pulse
    "
  >
    <div
      class="
        padding--10
        bg--base-white
        shadow--3
        border-radius--4
      "
    >
      <div class="login-page min-width--full">
        <div
          v-if="isLoading"
          class="login-page__loading flex flex--direction-column flex--align-items-center"
        >
          <PLoader pSize="40" />
          <p class="login-page__loading-text margin-top--6 text-color--neutral-gray-600">
            Connexion en cours...
          </p>
        </div>

        <div
          v-else
          class="login-page__form flex flex--direction-column flex--align-items-center"
        >
          <div class="flex flex--direction-column flex--align-items-center margin-bottom--6">
            <PIcon
              pName="gear"
              pSize="40"
              :color="AppColors.JUNGLE_400"
              class="margin-bottom--3"
            />
            <h2 class="login-page__title margin--0 text-color--neutral-gray-900">
              Back Office
            </h2>
          </div>

          <p class="login-page__description text-color--neutral-gray-600 margin-bottom--6 text-align--center">
            Connectez-vous avec votre compte <strong>ADM-CLD</strong> pour accéder aux outils d'administration.
          </p>

          <PAlert
            v-if="errorMessage"
            pType="danger"
            class="margin-bottom--5"
            data-testid="backoffice-error-message-alert"
          >
            {{ errorMessage }}
          </PAlert>

          <PButton
            pType="primary"
            pSize="default"
            class="width--100"
            :pLoading="isLoading"
            :pDisabled="isLoading"
            aria-label="Se connecter avec votre compte adm-cld"
            data-testid="backoffice-login-button"
            @click="handleLogin"
          >
            <PIcon
              pName="lock"
              pSize="16"
              class="el-button__icon--left margin-right--1"
            />
            Se connecter
          </PButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PButton, PLoader, PIcon, PAlert } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { CurrentUserManager } from '@pulse/common/managers'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { AdminRouteNames } from '@backoffice/constants/backoffice-route-names.enum'
import { LoginManager } from '@backoffice/managers/login.manager'

const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref<string>('')

const handleMSALRedirectionAfterLogin = async () => {
  isLoading.value = true
  try {
    const msalToken = await AdminMsalService.getMSALToken()

    if (msalToken !== null) {
      CurrentUserManager.persistToken(msalToken)
      router.push({ name: AdminRouteNames.AUTHENTICATED })
      return
    }
  } catch (error) {
    logger.error('Failed to handle MSAL redirect:', error)
  } finally {
    isLoading.value = false
  }
}

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    await LoginManager.initAuthSSO()
  } catch (error) {
    logger.error('Failed to login:', error)
    errorMessage.value = 'Une erreur est survenue lors de la connexion. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // MSAL redirects to this page after SSO login
  // We need to handle the redirection and check if the user is successfully authenticated
  handleMSALRedirectionAfterLogin()
})
</script>

<style lang="scss" scoped>
.login-page {
  max-width: 500px;
}
</style>
