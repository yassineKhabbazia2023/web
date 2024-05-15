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
      <PSubMenu :pIndex="folderSubmenu.index" :pIcon="folderSubmenu.icon">
        <template #title>
          {{ folderSubmenu.title }}
        </template>
        <PMenuItem
          v-for="menuItem in folderSubmenu.menuItems"
          :key="menuItem.index"
          :pIndex="`/dossier/${selectedEntityId}/${menuItem.index}`"
          pRightIcon="PICheckCircle"
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
        :pDisabled="menuItem.disabled"
        :pLeftIcon="menuItem.leftIcon"
      >
        <template #title>
          {{ menuItem.title }}
        </template>
      </PMenuItem>
    </PMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { userPermissions } from '@kpmg/common'
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

const isMenuCollapsed = ref<boolean>(true)
const activeMenuItem = ref<string>(
  `/dossier/${props.selectedEntityId}/gestion-utilisateurs`,
)

const folderSubmenu = computed(() => ({
  index: 'folder',
  title: t('folder'),
  icon: 'PIHouse',
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
      display: hasPermission(PERMISSION_CODES.HISTORY),
    },
  ].filter((item) => item.display),
}))

const menuItems = computed(() => [
  {
    index: `/dossier/${props.selectedEntityId}/ged`,
    title: t('documents'),
    leftIcon: 'PIFileText',
    display: hasPermission(PERMISSION_CODES.ACCOUNT_GED),
  },
  {
    index: 'bank',
    title: t('bank'),
    leftIcon: 'PIPiggyBank',
    disabled: true,
    display: true,
  },
  {
    index: 'indicators',
    title: t('indicators'),
    leftIcon: 'PIClipboardData',
    disabled: true,
    display: true,
  },
].filter((item) => item.display))

watch(route, (currentRoute) => {
  activeMenuItem.value = currentRoute.fullPath
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
  bank: 'Bank'
  indicators: 'Indicators'
  delegationsHistory: 'Delegations history'
fr-FR:
  folder: 'Dossier'
  users: 'Utilisateurs'
  information: 'Informations'
  offers: 'Offres'
  collaborators: 'Collaborateurs'
  documents: 'Documents'
  bank: 'Banque'
  indicators: 'Indicateurs'
  delegationsHistory: 'Historique des délégations'
</i18n>
