<template>
  <nav
    class="
      mobile-bottom-nav
      shadow--1-inverted
      flex
      flex--justify-content-space-around
      flex--align-items-center
      padding-x--12
    "
    data-testid="mobile-bottom-nav"
  >
    <router-link
      v-for="menuItem in mobileMenuItems"
      :key="menuItem.routeName"
      :to="getMenuItemRoute(menuItem)"
      :class="[
        'mobile-bottom-nav__item',
        'flex',
        'flex--direction-column',
        'flex--align-items-center',
        'flex-gap--1',
        { 'mobile-bottom-nav__item--active': isMenuItemActive(menuItem) },
      ]"
      :data-testid="`mobile-nav-${menuItem.routeName}`"
      @click="trackNavigationFeature(menuItem)"
    >
      <PIcon
        :pName="menuItem.icon"
        pSize="25"
        :pColor="isMenuItemActive(menuItem) ? activeColor : inactiveColor"
      />
      <span class="mobile-bottom-nav__label font-semibold">{{ t(menuItem.title) }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Feature, RouteName } from '@pulse/common/enums'
import { RouterHelpers } from '@pulse/common/helpers'
import { FeatureFlagManager } from '@pulse/common/managers'
import { PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { NavigationManager } from '@pulse/shared/managers'
import { useNavigationContext, useNavigationTracking } from '@pulse/shared/composables'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import type { NavigationItem } from '@pulse/shared/types'
import type { MobileBottomNavProps } from './mobile-bottom-nav.type'
import { MOBILE_BOTTOM_NAV_HEIGHT } from '../../mobile-home.const'

// Collaborators only ever see a single wallet entry in the mobile bottom nav:
// prospects when the prospect experience is enabled, otherwise the regular folders.
const COLLAB_PROSPECTS_MENU_ITEM: NavigationItem = {
  routeName: RouteName.PROSPECTS,
  title: 'shared.sidebar.prospects',
  icon: 'building',
  activeRoutes: [RouteName.PROSPECTS],
  showInMobile: true,
}

const COLLAB_FOLDERS_MENU_ITEM: NavigationItem = {
  routeName: RouteName.FOLDERS,
  title: 'shared.sidebar.folders',
  icon: 'building',
  activeRoutes: [RouteName.FOLDERS],
  showInMobile: true,
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const route = useRoute()

const props = defineProps<MobileBottomNavProps>()

const { currentAccountType } = storeToRefs(useCurrentEntityStore())
const { isCollab } = storeToRefs(useUserStore())
const { navigationContext } = useNavigationContext(() => props.currentEntityId)
const { trackNavigationFeature } = useNavigationTracking()

const mobileMenuItems = computed<NavigationItem[]>(() => {
  if (isCollab.value === true) {
    return FeatureFlagManager.isFeatureActivated(Feature.PROSPECT_EXPERIENCE) === true
      ? [COLLAB_PROSPECTS_MENU_ITEM]
      : [COLLAB_FOLDERS_MENU_ITEM]
  }

  return NavigationManager
    .getNavigationItems(navigationContext.value, currentAccountType.value)
    .filter(item => item.showInMobile === true)
})

const getMenuItemRoute = (menuItem: NavigationItem) => {
  if (isCollab.value === true) {
    return { name: menuItem.routeName }
  }

  return { name: menuItem.routeName, params: { entityId: props.currentEntityId } }
}

const isMenuItemActive = (menuItem: NavigationItem): boolean => {
  if (route.name === undefined || route.name === null) {
    return false
  }
  return (
    RouterHelpers.hasProvidedAncestor({ route, ancestorName: menuItem.routeName })
    || menuItem.activeRoutes.includes(route.name as RouteName)
  )
}

const activeColor = AppColors.JUNGLE_400
const inactiveColor = AppColors.BLACK_ROCK_900
</script>

<style lang="scss" scoped>
$mobile-bottom-nav-height: v-bind('`${MOBILE_BOTTOM_NAV_HEIGHT}px`');

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $mobile-bottom-nav-height;
  background-color: var(--p-white);
  z-index: 20;
  padding-bottom: env(safe-area-inset-bottom);

  &__item {
    flex: 1;
    padding: 8px 12px;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;

    &--active {
      color: var(--p-jungle-400);
    }

    &--active &__label {
      color: var(--p-jungle-400);
    }
  }

  &__label {
    font-size: 1.2rem;
    line-height: 1.2;
  }
}
</style>

