<template>
  <div
    :class="[
      'sidenav-entity-menu',
      { 'sidenav-entity-menu--collapsed': isMenuCollapsed },
    ]"
    @mouseover="isMenuCollapsed = false"
    @mouseleave="isMenuCollapsed = true"
  >
    <PMenu
      :pDefaultActive="activeMenuItem"
      :pCollapse="isMenuCollapsed"
      pRouter
      class="sidenav-entity-menu__main-menu"
      data-testid="sidenav-menu"
    >
      <PMenuItem
        :pIndex="`/dossier/${props.selectedEntityId}`"
        pLeftIcon="PIHouse"
      >
        <template #title>
          {{ t('home') }}
        </template>
      </PMenuItem>
      <PSubMenu :pIndex="folderSubmenu.index" :pIcon="folderSubmenu.icon">
        <template #title>
          {{ folderSubmenu.title }}
        </template>
        <PMenuItem
          v-for="menuItem in folderSubmenu.menuItems"
          :key="menuItem.index"
          :pIndex="`/dossier/${selectedEntityId}/${menuItem.index}`"
          pRightIcon="PICheckCircle"
          data-testid="nested-menu-item"
          @click="logAmplitudeEvent(menuItem.title)"
        >
          <template #title>
            {{ menuItem.title }}
          </template>
        </PMenuItem>
      </PSubMenu>
      <PMenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.index"
        :pIndex="menuItem.index"
        :pLeftIcon="menuItem.leftIcon"
        data-testid="menu-item"
        @click="logAmplitudeEvent(menuItem.title)"
      >
        <template #title>
          {{ menuItem.title }}
        </template>
      </PMenuItem>
    </PMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { amplitudeService, userPermissions, commonStore } from '@kpmg/common'
import { fetchBIReports } from '@/services/reporting'
import { PMenuItem, PMenu, PSubMenu } from '@kpmg/styleguide'
import { PERMISSION_CODES } from '@/constants'
import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'

const route = useRoute()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SidebarEntityMenuProps>()
const { hasPermission } = userPermissions()
const { isCollab } = storeToRefs(commonStore())

const hasBIReports = ref(false)
const isMenuCollapsed = ref(true)
const activeMenuItem = ref<string>(route.fullPath)

const folderSubmenu = computed(() => ({
  index: 'folder',
  title: t('folder'),
  icon: 'PIBuilding',
  menuItems: [
    {
      title: t('users'),
      index: 'gestion-utilisateurs',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_USERS),
    },
    {
      title: t('collaborators'),
      index: 'collaborateurs',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_COLLABORATORS),
    },
    {
      title: t('offers'),
      index: 'offres',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_OFFER),
    },
    {
      title: t('information'),
      index: 'informations',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_INFORMATION),
    },
    {
      title: t('delegationsHistory'),
      index: 'historique-delegations',
      display: isCollab.value && hasPermission(PERMISSION_CODES.HISTORY),
    },
  ].filter((item) => item.display),
}))

const menuItems = computed(() =>
  [
    {
      title: t('biReports'),
      index: `/dossier/${props.selectedEntityId}/rapports-bi`,
      leftIcon: 'PIClipboardData',
      display: hasBIReports.value,
    },
    {
      index: `/dossier/${props.selectedEntityId}/ged`,
      title: t('documents'),
      leftIcon: 'PIFolder',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_GED),
    },
    {
      index: `/dossier/${props.selectedEntityId}/banque`,
      title: t('bank'),
      leftIcon: 'PIPiggyBank',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_BANK),
    },
    {
      index: `/dossier/${props.selectedEntityId}/indicateurs`,
      title: t('indicators'),
      leftIcon: 'PISpeedometer2',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_INDICATORS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/launcher`,
      title: t('apps'),
      leftIcon: 'PIGrid',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_APPS),
    },
  ].filter((item) => item.display),
)

const logAmplitudeEvent = (featureName: string) => {
  amplitudeService.track('Feature Consulted', {
    feature_name: featureName.toLowerCase(),
  })
}

watch(route, (currentRoute) => {
  activeMenuItem.value = currentRoute.fullPath
})

onMounted(async () => {
  const { totalItems } = await fetchBIReports(props.selectedEntityId)
  hasBIReports.value = totalItems > 0
})
</script>

<style lang="scss" scoped>
.sidenav-entity-menu {
  --smooth-transition: 0.3s ease;

  z-index: 8;
  position: absolute;
  left: calc(100% - 52px);
  top: 0;
  width: 200px;
  height: 100%;
  padding-left: 10px;
  background-color: var(--el-color-persian-100);
  transition: width var(--smooth-transition);

  &--collapsed {
    width: 52px;
  }

  &__main-menu {
    margin-top: 72px;
  }

  @media only screen and (max-width: 991px) {
    left: 52px;
  }
}
</style>

<i18n lang="yaml">
en-US:
  folder: 'Folder'
  users: 'Users'
  information: 'Information'
  offers: 'Offers'
  collaborators: 'Collaborators'
  documents: 'Documents'
  apps: 'Applications'
  bank: 'Bank'
  indicators: 'Indicators'
  delegationsHistory: 'Delegations history'
  home: 'Home'
  biReports: 'BI reports'
fr-FR:
  folder: 'Dossier'
  users: 'Utilisateurs'
  information: 'Informations'
  offers: 'Offres'
  collaborators: 'Collaborateurs'
  documents: 'Documents'
  apps: 'Applications'
  bank: 'Banque'
  indicators: 'Indicateurs'
  delegationsHistory: 'Historique des délégations'
  home: 'Accueil'
  biReports: 'Rapports BI'
</i18n>
