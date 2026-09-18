<template>
  <div
    :class="[
      'sidebar-entity',
      'position--relative',
      'flex--shrink-0',
      'height--100',
      { 'sidebar-entity--collapsed': isMenuCollapsed },
      { 'sidebar-entity--is-collab': userStore.isCollab === true },
    ]"
    data-testid="sidenav-entity-menu"
    @mouseover="isMenuCollapsed = false"
    @mouseleave="isMenuCollapsed = true"
  >
    <PMenu
      :pDefaultActive="isMenuItemActive"
      :pCollapse="isMenuCollapsed"
      pRouter
      class="sidebar-entity__main-menu"
      data-testid="sidenav-menu"
    >
      <PMenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.routeName"
        :pIndex="menuItem.routeName"
        :pRoute="{ name: menuItem.routeName, params: { entityId: currentEntityId } }"
        :pIconLeftName="menuItem.icon"
        data-testid="menu-item"
        :class="{ 'sidebar-entity__item-menu': menuItem.hasSubmenuSelected === true }"
        @click="trackNavigationFeature(menuItem)"
      >
        <template #title>
          {{ t(menuItem.title) }}
        </template>
      </PMenuItem>
    </PMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { PMenuItem, PMenu } from '@pulse/styleguide/components'
import { NavigationManager } from '@pulse/shared/managers'
import { useNavigationContext, useNavigationTracking } from '@pulse/shared/composables'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const route = useRoute()
const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()
const { currentEntityId, currentAccountType } = storeToRefs(currentEntityStore)

const isMenuCollapsed = ref(true)

const isMenuItemActive = computed<string>(() => route.name as string)

const { navigationContext, refreshBIReports } = useNavigationContext(currentEntityId)
const { trackNavigationFeature } = useNavigationTracking()

const menuItems = computed(() =>
  NavigationManager.getNavigationItems(navigationContext.value, currentAccountType.value),
)

// Refresh the entries read from the API on mount and when entity changes
watch(currentEntityId, () => {
  refreshBIReports()
}, { immediate: true })
</script>

<style lang="scss" scoped>
$sidenav-collapsed-width: 50px;
$sidenav-opened-width: 200px;

.sidebar-entity {
  --smooth-transition: 0.3s ease;

  z-index: 8;
  width: $sidenav-opened-width;
  margin-right: calc($sidenav-collapsed-width - $sidenav-opened-width);
  background-color: var(--p-tranquil-50);
  transition: width var(--smooth-transition), margin-right var(--smooth-transition);

  &--collapsed {
    width: $sidenav-collapsed-width;
    margin-right: 0;
  }

  &__main-menu {
    margin-top: calc(var(--p-header-height) + 50px);
  }

  &__item-menu {
    background-color: var(--p-jungle-100);
    border-color: var(--p-jungle-400) !important;
  }
}
</style>

<style lang="scss">
.sidebar-entity--is-collab {
  background-color: var(--p-persian-100) !important;

  .p-menu.el-menu {
    background-color: var(--p-persian-100);

    .p-menu-item {
      &:hover {
        background-color: #F2F2FF;
      }

      &.is-active,
      &.sidebar-entity__item-menu {
        background-color: rgba(var(--p-black-rock-700-rgb), 0.2);
        border-color: var(--p-black-rock-700) !important;
      }
    }
  }
}
</style>
