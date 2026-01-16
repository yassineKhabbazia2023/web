<template>
  <nav
    class="
      mobile-bottom-nav
      shadow--1-inverted
      flex
      flex--justify-content-space-around
      flex--align-items-center
    "
    data-testid="mobile-bottom-nav"
  >
    <router-link
      :to="{ name: RouteName.HOMEPAGE, params: { entityId: currentEntityId } }"
      :class="[
        'mobile-bottom-nav__item',
        'flex',
        'flex--direction-column',
        'flex--align-items-center',
        'flex-gap--1',
        { 'mobile-bottom-nav__item--active': isHomeActive },
      ]"
      data-testid="mobile-nav-home"
    >
      <PIcon
        pName="house"
        pSize="25"
        :pColor="isHomeActive ? activeColor : inactiveColor"
      />
      <span class="mobile-bottom-nav__label font-semibold">{{ t('shared.sidebar.home') }}</span>
    </router-link>

    <router-link
      v-if="entityOverviewMenuItem"
      :to="{ name: entityOverviewMenuItem.routeName, params: { entityId: currentEntityId } }"
      :class="[
        'mobile-bottom-nav__item',
        'flex',
        'flex--direction-column',
        'flex--align-items-center',
        'flex-gap--1',
        { 'mobile-bottom-nav__item--active': isEntityActive },
      ]"
      data-testid="mobile-nav-entity"
      @click="logStaticNavEvent('entity')"
    >
      <PIcon
        pName="building"
        pSize="25"
        :pColor="isEntityActive ? activeColor : inactiveColor"
      />
      <span class="mobile-bottom-nav__label font-semibold">{{ t(entityOverviewMenuItem.title) }}</span>
    </router-link>

    <router-link
      v-for="menuItem in mobileMenuItems"
      :key="menuItem.routeName"
      :to="{ name: menuItem.routeName, params: { entityId: currentEntityId } }"
      :class="[
        'mobile-bottom-nav__item',
        'flex',
        'flex--direction-column',
        'flex--align-items-center',
        'flex-gap--1',
        { 'mobile-bottom-nav__item--active': isMenuItemActive(menuItem) },
      ]"
      :data-testid="`mobile-nav-${menuItem.routeName}`"
      @click="logAmplitudeEvent(menuItem)"
    >
      <PIcon
        :pName="menuItem.icon"
        pSize="25"
        :pColor="isMenuItemActive(menuItem) ? activeColor : inactiveColor"
      />
      <span class="mobile-bottom-nav__label font-semibold">{{ t(menuItem.title) }}</span>
    </router-link>

    <button
      type="button"
      :class="[
        'mobile-bottom-nav__item',
        'flex',
        'flex--direction-column',
        'flex--align-items-center',
        'flex-gap--1',
        { 'mobile-bottom-nav__item--active': isMenuActive },
      ]"
      data-testid="mobile-nav-menu"
      @click="handleMenuClick"
    >
      <div class="mobile-bottom-nav__avatar-wrapper">
        <PAvatar
          pShape="circle"
          pType="xsmall"
          :pRole="userRole"
        >
          {{ userInitials }}
        </PAvatar>
        <div
          class="
            mobile-bottom-nav__menu-badge
            flex
            flex--align-items-center
            flex--justify-content-center
            shadow--1
          "
        >
          <PIcon
            pName="menu"
            pSize="10"
            :pColor="isMenuActive ? activeColor : inactiveColor"
          />
        </div>
      </div>
      <span class="mobile-bottom-nav__label font-semibold">{{ t('menu') }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { getInitials } from '@pulse/common'
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import { AppColors, AvatarRoles } from '@pulse/styleguide'
import { storeToRefs } from 'pinia'
import { NavigationManager } from '@pulse/shared/managers'
import { useMenuContext } from '@pulse/shared/composables'
import type { NavigationItem } from '@pulse/shared/types'
import type { MobileBottomNavProps } from './mobile-bottom-nav.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const route = useRoute()
const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const props = defineProps<MobileBottomNavProps>()

const userInitials = computed(() =>
  getInitials(user.value?.firstName, user.value?.lastName),
)

const userRole = computed(() => {
  const isCollab = userStore.isCollab
  return isCollab ? AvatarRoles.COLLAB : AvatarRoles.CLIENT
})

const emit = defineEmits<{
  'showUserProfileDrawer': []
}>()

const { menuContext } = useMenuContext(() => props.currentEntityId)

const entityOverviewMenuItem = computed(() => NavigationManager.getEntityOverviewMenuItem(menuContext.value))

const mobileMenuItems = computed(() =>
  NavigationManager.getMenuItems(menuContext.value).filter(item => item.showInMobile === true),
)

const isMenuItemActive = (menuItem: NavigationItem): boolean => {
  if (route.name === undefined || route.name === null) {
    return false
  }
  return menuItem.activeRoutes.includes(route.name as RouteName)
}

const activeColor = AppColors.PERSIAN_400
const inactiveColor = AppColors.BLACK_ROCK_900

const isMenuActive = computed(() => props.isMenuActive === true)

const isHomeActive = computed(() => route.name === RouteName.HOMEPAGE)

const isEntityActive = computed(() => {
  if (route.name === undefined || route.name === null) {
    return false
  }
  const entityRoutes = NavigationManager.getEntityOverviewActiveRoutes()
  return entityRoutes.includes(route.name as RouteName)
})

const handleMenuClick = () => {
  emit('showUserProfileDrawer')
}

const logAmplitudeEvent = (menuItem: NavigationItem) => {
  const { featureName, title } = menuItem

  AmplitudeService.track('Feature Consulted', {
    feature_name: featureName === undefined
      ? t(title).toLowerCase()
      : featureName,
  })
}

const logStaticNavEvent = (featureName: string) => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: featureName,
  })
}
</script>

<style lang="scss" scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--p-white);
  z-index: 20;
  padding-bottom: env(safe-area-inset-bottom);

  &__item {
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

  &__avatar-wrapper {
    position: relative;
    display: inline-block;
  }

  &__menu-badge {
    position: absolute;
    bottom: -2px;
    right: -4px;
    width: 16px;
    height: 16px;
    background-color: var(--p-white);
    border-radius: 50%;
  }
}
</style>

<i18n lang="json">
{
  "en-US": {
    "menu": "Menu"
  },
  "fr-FR": {
    "menu": "Menu"
  }
}
</i18n>
