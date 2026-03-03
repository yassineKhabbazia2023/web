<template>
  <div class="dashboard-layout flex flex--direction-column height--100vh">
    <header
      class="dashboard-layout__header bg--base-blue-pulse text-white position--relative shadow--5"
      data-testid="backoffice-header"
    >
      <div
        class="
          dashboard-layout__toolbar
          flex
          flex--justify-content-space-between
          flex--align-items-center
          padding--6
          min-height--16
          text-color--base-white
        "
      >
        <div class="dashboard-layout__title flex flex--align-items-center margin--0">
          <PIcon
            pName="gear"
            pSize="32"
            color="white"
            class="margin-right--3"
          />
          <h4 class="dashboard-layout__title-text font-bold padding-right--4 margin-right--4">
            Back Office
          </h4>
          <nav class="dashboard-layout__nav flex flex--align-items-center flex-gap--2">
            <router-link
              :to="{ name: AdminRouteNames.APP_SETTINGS }"
              class="dashboard-layout__nav-link"
              :class="{ 'dashboard-layout__nav-link--active': isAppSettingsActive }"
            >
              Variables d'environnement
            </router-link>
            <router-link
              :to="{ name: AdminRouteNames.AZURE_DEVOPS }"
              class="dashboard-layout__nav-link"
              :class="{ 'dashboard-layout__nav-link--active': isAzureDevopsActive }"
            >
              Azure DevOps
            </router-link>
            <router-link
              :to="{ name: AdminRouteNames.AI_MONITORING }"
              class="dashboard-layout__nav-link"
              :class="{ 'dashboard-layout__nav-link--active': isAiMonitoringActive }"
            >
              Dashboard Monitoring IA
            </router-link>
          </nav>
        </div>

        <div class="dashboard-layout__actions flex flex--align-items-center text-color--white flex-gap--4">
          <div
            v-if="userInfo"
            class="dashboard-layout__user-greeting flex flex--align-items-center flex-gap--2"
          >
            <div
              class="dashboard-layout__user-avatar flex flex--align-items-center flex--justify-content-center
                radius--circle font-bold font-small height--10 shadow--1"
              data-testid="backoffice-user-initials-text"
            >
              {{ userInitials }}
            </div>
            <div class="dashboard-layout__greeting-text flex flex--direction-column flex-gap--0">
              <p class="font-light font-small margin--0 no-wrap">
                Bonjour
              </p>
              <p class="font-bold margin--0 no-wrap" data-testid="backoffice-user-name-text">
                {{ firstName }}
              </p>
            </div>
          </div>
          <PTooltip pContent="Se déconnecter">
            <PButton
              class="dashboard-layout__logout-button"
              pType="default"
              pSize="small"
              :pLoading="isLoading"
              data-testid="backoffice-logout-button"
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

    <main class="dashboard-layout__content flex--grow-1 bg--gray-50">
      <div class="dashboard-layout__container padding-x--6 padding-y--4">
        <div class="dashboard-layout__page-content min-height--50">
          <router-view v-slot="{ Component }">
            <transition name="slide-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>

    <footer class="dashboard-layout__footer flex flex--justify-content-center padding-y--2">
      <p class="text-color--neutral-gray-400 font-small">
        {{ APP_COPYRIGHT }}
      </p>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import type { AccountInfo } from '@azure/msal-browser'
import { PButton, PIcon, PTooltip } from '@pulse/styleguide/components'
import { logger } from '@pulse/toolbox'
import { useRouter, useRoute } from 'vue-router'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { AdminRouteNames } from '@backoffice/constants/backoffice-route-names.enum'
import { LoginManager } from '@backoffice/managers/login.manager'
import { APP_COPYRIGHT } from '@backoffice/constants/backoffice.const'
import { getFirstName, getUserInitials } from '@backoffice/utils/authenticated.root.page.utils'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const userInfo = ref<AccountInfo | null>(null)

const firstName = computed(() => getFirstName(userInfo.value?.name))
const userInitials = computed(() => getUserInitials(userInfo.value?.name))
const isAppSettingsActive = computed(() => route.name === AdminRouteNames.APP_SETTINGS)
const isAzureDevopsActive = computed(() => route.name === AdminRouteNames.AZURE_DEVOPS)
const isAiMonitoringActive = computed(() => route.name === AdminRouteNames.AI_MONITORING)

const handleLogout = async () => {
  isLoading.value = true
  try {
    await LoginManager.handleLogout()
  } catch (error) {
    logger.error('Failed to logout:', error)
    LoginManager.clearAuthStorage()
  } finally {
    router.push({ name: AdminRouteNames.LOGIN })
    isLoading.value = false
  }
}

onMounted(async () => {
  try {
    const account = await AdminMsalService.getAccount()
    if (account !== null) {
      userInfo.value = account
      logger.info('User logged in:', account.username)
    }
  } catch (error) {
    logger.error('Failed to load user information:', error)
  }
})
</script>

<style lang="scss" scoped>
.dashboard-layout {
  &__header {
    z-index: 10;
  }

  &__toolbar {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__title-text {
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-right: 3px solid rgba(255, 255, 255, 0.3);
    margin-top: 0;
    margin-bottom: 0;
  }

  &__user-avatar {
    width: 40px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }
  }

  &__greeting-text {
    line-height: 1.2;
  }

  &__nav-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: all 0.2s ease;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    &--active {
      color: white;
      background: rgba(255, 255, 255, 0.2);
      font-weight: 600;
    }
  }

  &__logout-button {
    transition: all 0.2s ease;
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.4);
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  }
}
</style>
