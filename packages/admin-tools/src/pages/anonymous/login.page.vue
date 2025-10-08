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
        padding--8
        bg--base-white
      "
    >
      <div class="login-container max-width-400 min-width--full">
        <div v-if="isLoading" class="loading-section text-align--center">
          <PLoader />
          <p class="loading-text margin-top--4">
            Connexion en cours...
          </p>
        </div>

        <div v-else class="login-form text-align--center">
          <h3 class="login-title margin-bottom--4">
            Admin Tools
          </h3>
          <p class="login-description text-color--neutral-gray-500 margin-bottom--6">
            Connectez-vous avec votre compte Azure AD pour accéder aux outils d'administration.
          </p>
          <PButton
            pType="primary"
            class="width--100"
            :pLoading="isLoading"
            @click="handleLogin"
          >
            <PIcon
              pName="person"
              pSize="16"
              class="el-button__icon--left"
            />
            Se connecter avec Azure AD
          </PButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PButton, PLoader, PIcon } from '@pulse/styleguide/components'
import { logger } from '@pulse/toolbox'
import { useRouter } from 'vue-router'
import { LoginManager } from '@admin-tools/managers/login.manager'
import { AdminRouteNames } from '@admin-tools/constants/admin-tools-route-names.enum'

const router = useRouter()
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  try {
    await LoginManager.initAuthSSO()
    router.push({ name: AdminRouteNames.ROOT })
  } catch (error) {
    logger.error('Erreur lors de la connexion:', error)
  } finally {
    isLoading.value = false
  }
}
</script>