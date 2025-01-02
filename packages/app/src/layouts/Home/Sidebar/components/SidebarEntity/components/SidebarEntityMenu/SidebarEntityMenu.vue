<template>
  <div
    :class="[
      'sidenav-entity-menu',
      { 'sidenav-entity-menu--collapsed': isMenuCollapsed },
      { 'sidenav-entity-menu--is-collab': isCollab },
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
      >
        <template #title>
          {{ t('home') }}
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
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { amplitudeService, userPermissions, commonStore } from '@pulse/common'
import { fetchBIReports } from '@app/services/reporting'
import { PMenuItem, PMenu, PSubMenu } from '@pulse/styleguide/components'
import { PERMISSION_CODES } from '@app/constants'
import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'
import type { IconName } from '@pulse/styleguide/types'

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


interface MenuItem {
  index: string
  title: string
  display: boolean
  iconLeftName?: IconName
}

const folderOrEntityMenuItem = computed<MenuItem[]>(() => {
  const title = isCollab.value ? t('folder') : t('entity')
  const menuItem = [
    {
      index: `/dossier/${props.selectedEntityId}/gestion-utilisateurs`,
      display: hasPermission(PERMISSION_CODES.ACCOUNT_USERS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/collaborateurs`,
      display: isCollab.value && hasPermission(PERMISSION_CODES.ACCOUNT_COLLABORATORS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/offres`,
      display: hasPermission(PERMISSION_CODES.ACCOUNT_OFFER),
    },
    {
      index: `/dossier/${props.selectedEntityId}/informations`,
      display: hasPermission(PERMISSION_CODES.ACCOUNT_INFORMATION),
    },
    {
      index: `/dossier/${props.selectedEntityId}/historique-delegations`,
      display: isCollab.value && hasPermission(PERMISSION_CODES.HISTORY),
    },
  ].find((item) => item.display)

  return menuItem
    ? [{
      index: menuItem.index,
      display: menuItem.display,
      title,
      iconLeftName: 'building',
    }]
    : []
})

const menuItems = computed<MenuItem[]>(() => {
  const list: MenuItem[] = [
    {
      title: t('biReports'),
      index: `/dossier/${props.selectedEntityId}/rapports-bi`,
      iconLeftName: 'clipboardData',
      display: hasBIReports.value,
    },
    {
      index: `/dossier/${props.selectedEntityId}/ged`,
      title: t('documents'),
      iconLeftName: 'folder',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_GED),
    },
    {
      index: `/dossier/${props.selectedEntityId}/banque`,
      title: t('bank'),
      iconLeftName: 'piggyBank',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_BANK),
    },
    {
      index: `/dossier/${props.selectedEntityId}/indicateurs`,
      title: t('indicators'),
      iconLeftName: 'speedometer2',
      display: hasPermission(PERMISSION_CODES.ACCOUNT_INDICATORS),
    },
    {
      index: `/dossier/${props.selectedEntityId}/launcher`,
      title: t('apps'),
      iconLeftName: 'grid',
      display: !isCollab.value && hasPermission(PERMISSION_CODES.ACCOUNT_APPS),
    },
  ]
  const filteredList = list.filter(({ display }) => display)
  const menuItems = folderOrEntityMenuItem.value.concat(filteredList)

  return menuItems
})

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
  $self: &;
  --smooth-transition: 0.3s ease;

  z-index: 8;
  position: absolute;
  left: calc(100% - 52px);
  top: 0;
  width: 200px;
  height: 100%;
  background-color: var(--el-color-base-persian-light);
  transition: width var(--smooth-transition);

  &--collapsed {
    width: 50px;
  }

  &__main-menu {
    // Same margin as left sidebar section - left section gap - left section first item height  - left section item margin-top
    margin-top: calc(56px + 50px);
  }

  @media only screen and (max-width: 991px) {
    left: 52px;
  }
}
</style>

<style lang="scss">
// context specific design system overrides
.sidenav-entity-menu--is-collab {
  background-color: var(--el-color-secondary-fuschia-bg) !important;

  .p-menu.el-menu {
    background-color: var(--el-color-secondary-fuschia-bg);

    .p-menu-item {
      &:hover {
        background-color: #F2F2FF;
      }

      &.is-active {
        background-color: rgba(var(--el-color-secondary-fuschia-rgb), 0.2);
        border-color: var(--el-color-secondary-fuschia);
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
fr-FR:
  folder: 'Dossier'
  entity: 'Entité'
  documents: 'Documents'
  apps: 'Applications'
  bank: 'Banque'
  indicators: 'Indicateurs'
  home: 'Accueil'
  biReports: 'Rapports BI'
</i18n>
