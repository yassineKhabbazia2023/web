<template>
  <div :class="{ 'padding-right--0': !isCurrentEntityActive }">
    <nav
      v-if="shouldDisplaySidebar"
      class="sidenav-entity flex flex--direction-column"
      :class="{
        'sidenav-entity--opened': isSidebarOpened,
        'sidenav-entity--is-collab': userConfig?.isCollab === true,
        'sidenav-entity--no-entity-selected': !isCurrentEntityActive,
      }"
      data-testid="sidenav-entity"
    >
      <!-- Sidebar items -->
      <ul class="sidenav-entity__actions flex flex--direction-column">
        <li
          class="flex flex--align-items-center"
          :class="{
            'text-right sidenav-entity__actions-toggle-item': isSidebarOpened,
          }"
        >
          <SidebarEntityItem
            :tooltipContent="isSidebarOpened ? t('shared.sidebar.close') : t('shared.sidebar.open')"
            :tooltipDisabled="isToggleTooltipDisabled"
            :class="{
              'sidenav-entity__actions-toggle--open': isSidebarOpened,
              'sidenav-entity__actions-toggle--close': !isSidebarOpened,
            }"
            data-testid="sidebar-toggle"
            @item-clicked="onToggleSidebar"
          >
            <PIcon
              :pName="isSidebarOpened ? 'arrowBarLeft' : 'arrowBarRight'"
              :color="AppColors.WHITE"
              class="sidenav-entity__actions-icon"
            />
          </SidebarEntityItem>
        </li>
        <li
          class="sidenav-entity__actions-wallet flex flex--align-items-center"
          :class="getActiveWallet"
          data-testid="wallet-item"
        >
          <SidebarEntityItem v-bind="walletItem">
            <PIcon
              :color="AppColors.WHITE"
              class="sidenav-entity__actions-icon"
              :class="isSidebarOpened ? 'margin-right--2' : 'margin-right--3'"
              pName="cardList"
            />
            <template #suffix-content>
              <p class="sidenav-entity__actions-wallet-text">
                {{ t('shared.sidebar.globalView') }}
              </p>
            </template>
          </SidebarEntityItem>
        </li>
        <li
          v-if="currentEntity !== undefined"
          :class="{
            'sidenav-entity__actions-active': isCurrentEntityActive,
          }"
          class="flex flex--align-items-center is-entity"
          data-testid="selected-entity"
        >
          <EntityAvatar
            :entity="currentEntity"
            :hideTooltip="isSidebarOpened"
            :class="{
              'sidenav__selected-item': isCurrentEntityActive,
            }"
          />
        </li>
      </ul>
      <!-- Star Divider -->
      <template v-if="favoriteEntities.length">
        <div
          class="sidenav-entity__star-divider flex flex--align-items-center margin-top--6 margin-bottom--1"
        >
          <div data-testid="star-divider">
            <PIcon
              class="sidenav-entity__star-divider-icon"
              :class="isSidebarOpened ? 'margin-right--2' : 'margin-right--3'"
              :color="AppColors.WHITE"
              size="14"
              pName="starFill"
            />
          </div>
          <p
            class="sidenav-entity__star-divider-text"
            :class="{ 'margin-left--3': !isSidebarOpened }"
          >
            {{ t('shared.sidebar.favorites') }}
          </p>
        </div>
        <!-- Favorite Entities -->
        <ul
          v-if="favoriteEntitiesSorted.length"
          class="sidenav-entity__favorites flex flex--direction-column"
          data-testid="favorite-entities"
        >
          <li v-for="(favoriteEntity, index) in favoriteEntitiesSorted" :key="index">
            <EntityAvatar
              data-testid="favorite-entity"
              :entity="favoriteEntity"
              :hideTooltip="isSidebarOpened"
              :selected="favoriteEntity.accountId === currentEntityId"
            />
          </li>
        </ul>
      </template>
      <AppVersion v-if="isSidebarOpened" />
    </nav>
    <SidebarEntityMenu
      v-if="isCurrentEntityActive && currentEntityId && userConfig"
      :isCollab="userConfig.isCollab"
      :isSingleEntity="userConfig.isSingleEntity"
      :currentEntityId="currentEntityId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { RouterHelpers } from '@pulse/common/helpers'
import { PIcon } from '@pulse/styleguide/components'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { AppColors } from '@pulse/styleguide'
import type { SidebarEntityItemProps } from './sidebar-entity-item/sidebar-entity-item.type'
import type { SidebarProps } from './sidebar.type'
import SidebarEntityItem from './sidebar-entity-item'
import SidebarEntityMenu from './sidebar-entity-menu'
import EntityAvatar from './entity-avatar'
import AppVersion from './app-version'

const route = useRoute()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<SidebarProps>()

const favoriteEntitiesSorted = computed(() => {
  return props.favoriteEntities.toSorted((a, b) => a.legalName.localeCompare(b.legalName))
})

const isSidebarOpened = ref(false)
const isToggleTooltipDisabled = ref(false)
const shouldDisplaySidebar = computed(() => {
  // Guard against undefined userConfig during initialization
  if (!props.userConfig) {
    return false
  }
  // sidebar should alway display for a collab user
  return props.userConfig.isCollab === true
    // sidebar shouldn't display for a single entity customer user
    || (props.userConfig.isCustomer === true && props.userConfig.isSingleEntity === false)
})

const walletItem = computed((): SidebarEntityItemProps => {
  const walletRouteName = RouteName.WALLET
  return {
    tooltipContent: t('shared.sidebar.globalView'),
    tooltipDisabled: isSidebarOpened.value,
    route: { name: walletRouteName },
  }
})

const routeEntityId = computed(() => {
  return route.params[RouteParam.ENTITY_ID] as string | undefined
})

const currentEntityId = computed(() => {
  const accountId = routeEntityId.value
  return accountId ? Number(accountId) : undefined
})

const isCurrentEntityActive = computed(() => {
  if (!routeEntityId.value) {
    return false
  }

  return !!route.meta?.[IS_UNITARY_VIEW_META]
})

const onToggleSidebar = () => {
  isToggleTooltipDisabled.value = true
  isSidebarOpened.value = !isSidebarOpened.value

  // To avoid simultaneous display of the next tooltip ('Close'/'Open')
  setTimeout(() => {
    isToggleTooltipDisabled.value = false
  }, 100)
}

const getActiveWallet = computed(() => {
  const routesWithActiveWallet = [RouteName.WALLET]
  if (RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch: routesWithActiveWallet })) {
    return 'sidenav-entity__actions-active'
  }

  return ''
})
</script>

<style scoped lang="scss">
.sidenav-entity {
  $self: &;
  --default-height: 50px;
  --default-size: 32px;
  --smooth-transition: 0.4s ease;

  position: sticky;
  top: 0;
  width: 50px;
  height: 100vh;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: var(--p-black-rock-900);
  transition: width var(--smooth-transition);
  overflow: hidden;

  &--opened {
    width: 240px;
  }

  &__actions,
  &__favorites {
    list-style: none;
  }

  &__star-divider {
    padding-left: 8px;
    &-icon {
      width: var(--default-size);
    }

    &-text {
      color: var(--p-white);
      font-size: 1.2rem;
      font-weight: 600;
      transition: all var(--smooth-transition);
    }
  }

  &__actions {
    > li {
      padding-left: 8px;
      height: var(--default-height);
    }

    $actions: &;
    margin-top: var(--p-header-height);

    &-icon {
      width: var(--default-size);
      transition: all var(--smooth-transition);
    }

    &-active {
      z-index: 10;
      position: relative;
      background-color: rgba(var(--p-tranquil-50-rgb), 0.2);
      border-right: 6px solid var(--p-tranquil-50);

      #{$actions}-wallet-text {
        font-weight: 600;
        color: var(--p-white);
      }

      #{$actions}-icon:hover {
        background-color: transparent;
      }
    }

    &-toggle {
      &-item {
        margin-right: 10px;
      }

      &--open {
        transition: all var(--smooth-transition);

        &:hover {
          transform: translateX(-4px);
        }
      }

      &--close {
        transition: all var(--smooth-transition);

        &:hover {
          transform: translateX(4px);
        }
      }
    }

    &-wallet-text {
      color: var(--p-white);
      font-weight: 400;
      transition: all var(--smooth-transition);
    }
  }

  &__favorites {
    gap: 12px;
    overflow-y: scroll;
    overscroll-behavior-y: contain;
    overflow-x: hidden;

    > li {
      padding-left: 8px;
    }

    li:first-child {
      margin-top: 12px;
    }

    li:last-child {
      margin-bottom: 16px;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }

  // context specific overrides
  &#{$self}--is-collab {
    background-color: var(--p-black-rock-900);

    #{$self}__actions-active {
      background-color: rgba(var(--p-black-rock-100-rgb), 0.2);
      border-right-color: var(--p-black-rock-100);
    }
  }

  &--no-entity-selected {
    #{$self}__actions-active {
      background-color: rgba(var(--p-white-rgb), 0.2) !important;
      border-right-color: var(--p-white) !important;
    }
  }
}
</style>
