<template>
  <div class="dashboard-layout flex flex--direction-column height--100vh">
    <!-- Header -->
    <header
      class="
        dashboard-header
        bg--base-blue-pulse
        text-white
      "
    >
      <div
        class="
          dashboard-toolbar
          flex
          flex--justify-content-between
          flex--align-items-center
          padding--6
          min-height--16
          text-color--base-white
        "
      >
        <h1 class="dashboard-title margin--0 flex--grow-1">
          Admin Tools
        </h1>

        <div
          class="
            dashboard-actions
            flex
            flex--align-items-center
            flex-gap--4
            text-color--white
          "
        >
          <span v-if="userInfo" class="user-info">
            {{ userInfo.username }}
          </span>
          <PTooltip pContent="Se déconnecter">
            <PButton
              pType="default"
              pSize="small"
              :pLoading="isLoading"
              @click="handleLogout"
            >
              <PIcon
                pName="power"
                pSize="18"
                color="white"
              />
            </PButton>
          </PTooltip>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-content flex--grow-1">
      <div class="dashboard-container padding--6">
        <!-- Navigation Tabs -->
        <PTabs
          v-model="activeTab"
          class="dashboard-tabs margin-bottom--6"
          @tab-click="handleTabClick"
        >
          <PTabPane pName="env-vars">
            <template #label>
              <div
                class="
                  flex
                  flex--align-items-center
                  flex-gap--2
                "
              >
                <PIcon
                  pName="gear"
                  pSize="14"
                />
                <span>Env-vars</span>
              </div>
            </template>
          </PTabPane>
        </PTabs>

        <!-- Page Content -->
        <div class="dashboard-page-content min-height--50">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { PButton, PTabs, PTabPane, PIcon, PTooltip } from '@pulse/styleguide/components'
import { logger } from '@pulse/toolbox'
import { useRouter, useRoute } from 'vue-router'
import { MsalService } from '@admin-tools/services/msal.service'
import { AdminRouteNames } from '@admin-tools/constants/admin-tools-route-names.enum'
import { LoginManager } from '@admin-tools/managers/login.manager'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const userInfo = ref<any>(null)

// Onglet actif basé sur la route courante
const activeTab = ref('env-vars')

const handleTabClick = (tabName: string) => {
  if (tabName === 'env-vars') {
    router.push({ name: AdminRouteNames.ENV_VARS })
  }
}

const handleLogout = async () => {
  isLoading.value = true
  try {
    await LoginManager.handleLogout()
  } catch (error) {
    logger.error('Erreur lors de la déconnexion:', error)
    LoginManager.clearLocalStorage() // force remove everything
  } finally {
    router.push({ name: AdminRouteNames.LOGIN })
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    const account = await MsalService.getAccount()
    if (account) {
      userInfo.value = account
      logger.info('Utilisateur connecté:', account.username)
    }

    // redirect to env-vars (default child route) if on root
    if (route.name === AdminRouteNames.ROOT) {
      router.replace({ name: AdminRouteNames.ENV_VARS })
    }
  } catch (error) {
    logger.error('Erreur lors du chargement des informations utilisateur:', error)
  }
})
</script>
