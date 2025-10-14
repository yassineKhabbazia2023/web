<template>
  <div
    :class="[
      'sidenav-entity-menu',
      { 'sidenav-entity-menu--collapsed': isMenuCollapsed },
      { 'sidenav-entity-menu--is-collab': isCollab },
      { 'sidenav-entity-menu--is-single-entity': canBeConsideredSingleEntity },
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
        pIconLeftName="house"
        data-testid="menu-item"
      >
        <template #title>
          {{ t('shared.sidebar.home') }}
        </template>
      </PMenuItem>
      <PMenuItem
        v-if="folderOrEntityMenuItem"
        :pIndex="folderOrEntityMenuItem.routePath"
        :pIconLeftName="folderOrEntityMenuItem.iconLeftName"
        data-testid="menu-item"
        :class="{ 'sidenav-entity-menu__item-menu': isEntityOrFolderPath }"
      >
        <template #title>
          {{ t(folderOrEntityMenuItem.title) }}
        </template>
      </PMenuItem>
      <PMenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.routePath"
        :pIndex="menuItem.routePath"
        :pIconLeftName="menuItem.iconLeftName"
        data-testid="menu-item"
        :class="{ 'sidenav-entity-menu__item-menu': menuItem.hasSubmenuSelected === true }"
        @click="logAmplitudeEvent(menuItem)"
      >
        <template #title>
          {{ t(menuItem.title) }}
        </template>
      </PMenuItem>
    </PMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteName } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager, PennylanePermissionsManager, ReportingManager } from '@pulse/common/managers'
import { PMenuItem, PMenu } from '@pulse/styleguide/components'
import { ACCOUNT_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'
import { usePermissionsStore } from '@pulse/common/stores'
import { SidebarManager } from '../../../../manager/sidebar.manager'
import type { MenuItem, MenuContext } from '../../../../manager/sidebar.types'


const route = useRoute()
const router = useRouter()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SidebarEntityMenuProps>()

const shouldShowBIReports = ref(false)
const isMenuCollapsed = ref(true)
const activeMenuItem = ref<string>(route.path)
const isEntityOrFolderPath = ref(false)

const canBeConsideredSingleEntity = computed(() => {
  return props.isSingleEntity === true
  // collab can't be considered single entity users, even if they have only one entity
  && props.isCollab === false
})

// Build menu context for the manager
const menuContext = computed<MenuContext>(() => {
  const legacyGedRoute = router.resolve({
    name: RouteName.PENNYLANE_GED_LEGACY,
    params: { entityId: props.selectedEntityId },
  })

  return {
    entityId: props.selectedEntityId,
    isCollab: props.isCollab ?? false,
    currentRoute: route,
    legacyGedPath: legacyGedRoute.path,
    permissions: {
      shouldShowBIReports: shouldShowBIReports.value,
      hasPennylaneAccounting: PennylanePermissionsManager.hasPennylaneAccountingPermission(),
      hasPennylaneAccountingGedV2: PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === true,
      hasPennylaneAccountingGedLegacy: PennylanePermissionsManager.hasPennylaneAccountingGedLegacyPermission() === true,
      hasSocialManagementV2: PennylanePermissionsManager.hasSocialManagementV2() === true,
      hasGed: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.GED) === true,
      hasBank: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.BANK),
      hasIndicators: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INDICATORS),
      hasApps: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.APPS),
      hasUsers: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.USERS),
      hasCollaborators: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
      hasOffer: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.OFFER),
      hasInformation: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INFORMATION),
      hasHistory: CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.HISTORY),
    },
  }
})

// Get menu items from the manager
const menuItems = computed(() => SidebarManager.getMenuItems(menuContext.value))

// Get folder or entity menu item from the manager
const folderOrEntityMenuItem = computed(() => SidebarManager.getFolderOrEntityMenuItem(menuContext.value))

const logAmplitudeEvent = (menuItem: MenuItem) => {
  const { featureName, title } = menuItem

  AmplitudeService.track('Feature Consulted', {
    feature_name: featureName === undefined
      ? t(title).toLowerCase()
      : featureName,
  })
}

watchEffect(() => {
  activeMenuItem.value = route.path
  isEntityOrFolderPath.value =
    [
      'gestion-utilisateurs',
      'collaborateurs',
      'offres',
      'informations',
      'historique-delegations',
    ].some((path) => route.fullPath.includes(path))
})

const setMenuItem = async () => {
  shouldShowBIReports.value = await ReportingManager.canShowBIReports()
}

const permissionsStore = usePermissionsStore()
watch(() => [
  permissionsStore.selectedEntityPermissions,
  route.path,
], async () => {
  setMenuItem()
})

onMounted(async () => {
  // get menu item first time when loaded page
  setMenuItem()
})
</script>

<style lang="scss" scoped>
$sidenav-collapsed-width: 50px;
$sidenav-opened-width: 200px;

.sidenav-entity-menu {
  $self: &;
  --smooth-transition: 0.3s ease;

  z-index: 8;
  position: absolute;
  // 100% is the full width of .sidebar-container
  // That way the sidenav always sticks to the right part of the nav menu
  left: calc(100% - #{$sidenav-collapsed-width});
  top: 0;
  width: $sidenav-opened-width;
  height: 100%;
  background-color: var(--p-tranquil-50);
  transition: width var(--smooth-transition);

  &--collapsed {
    width: $sidenav-collapsed-width;
  }

  &__main-menu {
    // Same margin as left sidebar
    // section - left section gap - left section first item height  - left section item margin-top
    margin-top: calc(var(--p-header-height) + 50px);
  }

  &__item-menu {
    // customer colors (collab have their own class .sidenav-entity-menu--is-collab below)
    background-color: var(--p-jungle-100);
    // we need to override the default border color with !important
    border-color: var(--p-jungle-400) !important;
  }

  &--is-single-entity {
    left: 0;
  }
}
</style>

<style lang="scss">
// context specific design system overrides
.sidenav-entity-menu--is-collab {
  background-color: var(--p-persian-100) !important;

  .p-menu.el-menu {
    background-color: var(--p-persian-100);

    .p-menu-item {
      &:hover {
        background-color: #F2F2FF;
      }

      &.is-active,
      &.sidenav-entity-menu__item-menu
       {
        background-color: rgba(var(--p-black-rock-700-rgb), 0.2);
        // we need to override the default and customer border color with !important
        border-color: var(--p-black-rock-700) !important;
      }
    }
  }
}
</style>

