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
          {{ t('home') }}
        </template>
      </PMenuItem>
      <PMenuItem
        v-if="folderOrEntityMenuItem"
        :pIndex="folderOrEntityMenuItem.index"
        :pIconLeftName="folderOrEntityMenuItem.iconLeftName"
        data-testid="menu-item"
        :class="{ 'sidenav-entity-menu__item-menu': isEntityOrFolderPath }"
      >
        <template #title>
          {{ folderOrEntityMenuItem.title }}
        </template>
      </PMenuItem>
      <PMenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.index"
        :pIndex="menuItem.index"
        :pIconLeftName="menuItem.iconLeftName"
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
import { ref, watchEffect, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { CurrentUserManager, PennylanePermissionsManager } from '@pulse/common/managers'
import { PMenuItem, PMenu } from '@pulse/styleguide/components'
import { ACCOUNT_PERMISSIONS, GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'
import type { IconName } from '@pulse/styleguide/types'
import { usePermissionsStore } from '@pulse/common/stores'

const route = useRoute()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SidebarEntityMenuProps>()

const isMenuCollapsed = ref(true)
const activeMenuItem = ref<string>(route.path)
const isEntityOrFolderPath = ref(false)

const canBeConsideredSingleEntity = computed(() => {
  return props.isSingleEntity === true
  // collab can't be considered single entity users, even if they have only one entity
  && props.isCollab === false
})

interface MenuItem {
  index: string
  title: string
  display: boolean
  iconLeftName?: IconName
}

const folderOrEntityMenuItem = computed<MenuItem | null>(() => {
  const title = props.isCollab ? t('folder') : t('entity')
  const menuItem = [
    {
      index: `/dossier/${props.selectedEntityId}/gestion-utilisateurs`,
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.USERS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/collaborateurs`,
      display: props.isCollab && CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.COLLABORATORS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/offres`,
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.OFFER),
    },
    {
      index: `/dossier/${props.selectedEntityId}/informations`,
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INFORMATION),
    },
    {
      index: `/dossier/${props.selectedEntityId}/historique-delegations`,
      display: props.isCollab && CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.HISTORY),
    },
  ].find((item) => item.display)
  return menuItem ? { index: menuItem.index,
    display: menuItem.display, title, iconLeftName: 'building' } : null
})

const getMenuItems = () => {
  const hasPennylaneAccountingPermission = PennylanePermissionsManager.hasPennylaneAccountingPermission()

  const list: MenuItem[] = [
    {
      title: t('biReports'),
      index: `/dossier/${props.selectedEntityId}/rapports-bi`,
      iconLeftName: 'clipboardData',
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.POWERBI_REPORT),
    },
    {
      index: `/dossier/${props.selectedEntityId}/ged`, // Legacy GED path
      title: t('documents'),
      iconLeftName: 'folder',
      // Need GED permission But not Pennylane Accounting permission which replace legacy GED
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.GED) && hasPennylaneAccountingPermission === false,
    },
    {
      index: `/dossier/${props.selectedEntityId}/comptabilite/rydge`, // Accounting GED path for Pennylane users
      title: t('pennylaneAccounting'),
      iconLeftName: 'archive',
      // Need specific Pennylane Accounting permission
      display: hasPennylaneAccountingPermission === true,
    },
    {
      index: `/dossier/${props.selectedEntityId}/gestion-sociale`, // Social-Management GED path for Pennylane users
      title: t('pennylaneSocialManagement'),
      iconLeftName: 'archive',
      // Need specific Pennylane Accounting permission
      display: hasPennylaneAccountingPermission === true,
    },
    {
      index: `/dossier/${props.selectedEntityId}/banque`,
      title: t('bank'),
      iconLeftName: 'piggyBank',
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.BANK),
    },
    {
      index: `/dossier/${props.selectedEntityId}/indicateurs`,
      title: t('indicators'),
      iconLeftName: 'speedometer2',
      display: CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.INDICATORS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/launcher`,
      title: t('apps'),
      iconLeftName: 'grid',
      display: !props.isCollab && CurrentUserManager.hasPermission(ACCOUNT_PERMISSIONS.APPS),
    },
  ]
  return list.filter(({ display }) => display)
}

const menuItemsRef = ref(getMenuItems())
const menuItems = computed({
  get: () => menuItemsRef.value,
  set: (newVal) => {
    menuItemsRef.value = newVal
  },
})

const logAmplitudeEvent = (featureName: string) => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: featureName.toLowerCase(),
  })
}

watchEffect(() => {
  activeMenuItem.value = route.path
  isEntityOrFolderPath.value = ['gestion-utilisateurs', 'collaborateurs', 'offres', 'informations', 'historique-delegations'].some((path) => route.fullPath.includes(path))
})
const setMenuItem = () => {
  menuItems.value = getMenuItems()
}

const permissionsStore = usePermissionsStore()
watch(() => permissionsStore.selectedEntityPermissions, async () => {
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
    margin-top: calc(56px + 50px);
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

<i18n lang="yaml">
en-US:
  folder: 'Folder'
  entity: 'Entity'
  documents: 'Documents'
  apps: 'Applications'
  bank: 'Bank'
  indicators: 'Indicators'
  home: 'Home'
  biReports: 'BI reports'
  pennylaneAccounting: 'Accounting'
  pennylaneSocialManagement: 'Social management'
fr-FR:
  folder: 'Dossier'
  entity: 'Entité'
  documents: 'Documents'
  apps: 'Applications'
  bank: 'Banque'
  indicators: 'Indicateurs'
  home: 'Accueil'
  biReports: 'Rapports BI'
  pennylaneAccounting: 'Comptabilité'
  pennylaneSocialManagement: 'Gestion sociale'
</i18n>
