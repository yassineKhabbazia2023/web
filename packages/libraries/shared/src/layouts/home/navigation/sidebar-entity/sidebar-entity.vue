<template>
  <div
    v-if="isEntityView"
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
        :pIndex="RouteName.HOMEPAGE"
        :pRoute="{ name: RouteName.HOMEPAGE }"
        pIconLeftName="house"
        data-testid="menu-item"
      >
        <template #title>
          {{ t('shared.sidebar.home') }}
        </template>
      </PMenuItem>
      <PMenuItem
        v-if="entityOverviewMenuItem"
        :pIndex="entityOverviewMenuItem.routeName"
        :pRoute="{ name: entityOverviewMenuItem.routeName, params: { entityId: currentEntityId } }"
        :pIconLeftName="entityOverviewMenuItem.icon"
        data-testid="menu-item"
        :class="{ 'sidebar-entity__item-menu': entityOverviewPath }"
      >
        <template #title>
          {{ t(entityOverviewMenuItem.title) }}
        </template>
      </PMenuItem>
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
import { RouteName } from '@pulse/common/enums'
import { PMenuItem, PMenu } from '@pulse/styleguide/components'
import { NavigationManager } from '@pulse/shared/managers'
import { useCurrentEntity, useMenuContext, useNavigationTracking } from '@pulse/shared/composables'
import { RouterHelpers } from '@pulse/common/helpers'
import { useUserStore } from '@pulse/common/stores'

const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const isMenuCollapsed = ref(true)
const { currentEntityId, isEntityView } = useCurrentEntity()

const isMenuItemActive = computed<string>(() => route.name as string)
const entityOverviewPath = computed(
  () => RouterHelpers.hasProvidedAncestor({ route, ancestorName: RouteName.ENTITY_OVERVIEW }),
)

const { menuContext, refreshBIReports } = useMenuContext(currentEntityId)
const { trackNavigationFeature } = useNavigationTracking()

const menuItems = computed(() => NavigationManager.getMenuItems(menuContext.value))
const entityOverviewMenuItem = computed(() => NavigationManager.getEntityOverviewMenuItem(menuContext.value))

// Refresh BI reports permission on mount and when entity changes
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
