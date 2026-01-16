<template>
  <div
    :class="[
      'sidenav-entity-menu',
      { 'sidenav-entity-menu--collapsed': isMenuCollapsed },
      { 'sidenav-entity-menu--is-collab': isCollab },
      { 'sidenav-entity-menu--is-single-entity': canBeConsideredSingleEntity },
    ]"
    data-testid="sidenav-entity-menu"
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
      <!-- Home menu item -->
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
      <!-- Entity overview menu item -->
      <PMenuItem
        v-if="entityOverviewMenuItem"
        :pIndex="entityOverviewMenuItem.routeName"
        :pRoute="{ name: entityOverviewMenuItem.routeName, params: { entityId: currentEntityId } }"
        :pIconLeftName="entityOverviewMenuItem.icon"
        data-testid="menu-item"
        :class="{ 'sidenav-entity-menu__item-menu': entityOverviewPath }"
      >
        <template #title>
          {{ t(entityOverviewMenuItem.title) }}
        </template>
      </PMenuItem>
      <!-- Other registered menu items -->
      <PMenuItem
        v-for="menuItem in menuItems"
        :key="menuItem.routeName"
        :pIndex="menuItem.routeName"
        :pRoute="{ name: menuItem.routeName, params: { entityId: currentEntityId } }"
        :pIconLeftName="menuItem.icon"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { PMenuItem, PMenu } from '@pulse/styleguide/components'
import type { SidebarEntityMenuProps } from './SidebarEntityMenuTypes'
import { NavigationManager } from '@pulse/shared/managers'
import { useMenuContext } from '@pulse/shared/composables'
import type { NavigationItem } from '@pulse/shared/types'
import { RouterHelpers } from '@pulse/common/helpers'

const route = useRoute()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<SidebarEntityMenuProps>()

const isMenuCollapsed = ref(true)

const activeMenuItem = computed<string>(() => route.name as string)
const entityOverviewPath = computed(
  () => RouterHelpers.hasProvidedAncestor({ route, ancestorName: RouteName.ENTITY_OVERVIEW }),
)

const canBeConsideredSingleEntity = computed(() => {
  return props.isSingleEntity === true
  // collab can't be considered single entity users, even if they have only one entity
  && props.isCollab === false
})

const { menuContext, refreshBIReports } = useMenuContext(() => props.currentEntityId)

// Refresh BI reports permission on mount and when entity changes
watch(() => route.params[RouteParam.ENTITY_ID], () => {
  refreshBIReports()
})

onMounted(() => {
  refreshBIReports()
})

// Get menu items from the manager
const menuItems = computed(() => NavigationManager.getMenuItems(menuContext.value))

// Get folder or entity menu item from the manager
const entityOverviewMenuItem = computed(() => NavigationManager.getEntityOverviewMenuItem(menuContext.value))

const logAmplitudeEvent = (menuItem: NavigationItem) => {
  const { featureName, title } = menuItem

  AmplitudeService.track('Feature Consulted', {
    feature_name: featureName === undefined
      ? t(title).toLowerCase()
      : featureName,
  })
}
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

