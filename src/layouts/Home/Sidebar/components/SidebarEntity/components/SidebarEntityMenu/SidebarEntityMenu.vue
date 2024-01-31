<template>
  <div
    :class="[
      'sidenav-entity-menu',
      { 'sidenav-entity-menu--collapsed': isMenuCollapsed }
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

<i18n lang="yaml">
en-US:
  folder: 'Folder'
  users: 'Users'
  information: 'Information'
  offers: 'Offers'
  history: 'History'
  collaborators: 'Collaborators'
  documents: 'Documents'
  bank: 'Bank'
  indicators: 'Indicators'
fr-FR:
  folder: 'Dossier'
  users: 'Utilisateurs'
  information: 'Informations'
  offers: 'Offres'
  history: 'Historique'
  collaborators: 'Collaborateurs'
  documents: 'Documents'
  bank: 'Banque'
  indicators: 'Indicateurs'
</i18n>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { PMenuItem, PMenu, PSubMenu } from '@kpmg/styleguide'
import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'

const route = useRoute()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const { selectedEntityId } = defineProps<SidebarEntityMenuProps>()

const isMenuCollapsed = ref<boolean>(true)
const activeMenuItem = ref<string>(`/dossier/${selectedEntityId}/utilisateurs`)

const folderSubmenu = {
  index: 'folder',
  title: t('folder'),
  icon: 'PIHouse',
  menuItems: [
    {
      title: t('users'),
      index: 'utilisateurs'
    },
    {
      title: t('collaborators'),
      index: 'collaborateur'
    },
    {
      title: t('offers'),
      index: 'offres'
    },
    {
      title: t('information'),
      index: 'informations'
    },
    {
      title: t('history'),
      index: 'historique'
    }
  ]
}

const menuItems = [
  {
    index: '/ged',
    title: t('documents'),
    leftIcon: 'PIFileText'
  },
  {
    index: 'bank',
    title: t('bank'),
    leftIcon: 'PIPiggyBank',
    disabled: true
  },
  {
    index: 'indicators',
    title: t('indicators'),
    leftIcon: 'PIClipboardData',
    disabled: true
  }
]

watch(
  route,
  (currentRoute) => {
    activeMenuItem.value = currentRoute.fullPath
  }
)
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
