<template>
  <div :class="{ 'padding-right--0': !isSelectedEntityActive }">
    <nav
      v-if="shouldDisplaySidebar"
      class="sidenav-entity flex flex--direction-column"
      :class="{
        'sidenav-entity--opened': isSidebarOpened,
        'sidenav-entity--is-collab': isCollab,
        'sidenav-entity--no-entity-selected': !isSelectedEntityActive,
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
            :tooltipContent="isSidebarOpened ? t('close') : t('open')"
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
                {{ t('globalView') }}
              </p>
            </template>
          </SidebarEntityItem>
        </li>
        <li
          v-if="selectedEntity"
          :class="{
            'sidenav-entity__actions-active': isSelectedEntityActive
          }"
          class="flex flex--align-items-center is-entity"
          data-testid="selected-entity"
        >
          <EntityAvatar
            :entity="selectedEntity"
            :hideTooltip="isSidebarOpened"
            :class="{
              'sidenav__selected-item': isSelectedEntityActive,
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
            {{ t('favorites') }}
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
              :selected="favoriteEntity.accountId === currentAccountId"
              @entity-selected="onEntitySelected"
            />
          </li>
        </ul>
      </template>
      <AppVersion v-if="isSidebarOpened" />
    </nav>
    <SidebarEntityMenu
      v-if="isSelectedEntityActive && currentAccountId"
      :isCollab="isCollab"
      :selectedEntityId="currentAccountId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { Entity } from '@pulse/common/types'
import { useUserStore } from '@pulse/common/stores'
import { SelectedEntityManager } from '@pulse/common/managers'
import { APP_ROUTES } from '@pulse/common/constants'
import { RouterHelpers } from '@pulse/common/helpers'
import { PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { SidebarEntityItemProps } from './components/SidebarEntityItem/SidebarEntityItemTypes'
import type { SidebarEntityProps } from './SidebarEntityTypes'
import SidebarEntityItem from './components/SidebarEntityItem'
import SidebarEntityMenu from './components/SidebarEntityMenu'
import EntityAvatar from './components/EntityAvatar'
import AppVersion from './components/AppVersion'

const route = useRoute()

const userStore = useUserStore()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<SidebarEntityProps>()

const { favoriteEntities } = storeToRefs(userStore)
const { isCollab, isCustomer } = storeToRefs(userStore)

const favoriteEntitiesSorted = computed(() => {
  return [...favoriteEntities.value].sort((a, b) => a.legalName.localeCompare(b.legalName))
})

const isSidebarOpened = ref(false)
const isToggleTooltipDisabled = ref(false)
const shouldDisplaySidebar = computed(() => {
  // sidebar should alway display for a collab user
  return isCollab.value === true
    // sidebar shouldn't display for a single entity customer user
    || (isCustomer.value === true && userStore.getIsSingleEntity() === false)
})

const walletItem = computed((): SidebarEntityItemProps => {
  const collabWalletRouteName = APP_ROUTES.wallet.collab.root.name
  const customerWalletRouteName = APP_ROUTES.wallet.client.root.name
  return {
    tooltipContent: t('globalView'),
    tooltipDisabled: isSidebarOpened.value,
    route: { name: isCollab.value === true ? collabWalletRouteName : customerWalletRouteName },
  }
})

const currentAccountId = computed(() => {
  const idParam = parseInt(`${route.params.id}`)

  return isNaN(idParam) ? undefined : idParam
})

const isSelectedEntityActive = computed(() => {
  if (!currentAccountId.value) {
    return false
  }

  let isUnitaryViewVisible = false


  const routesWithSidebarMenu = [
    'folder',
    'ged',
    'launcher',
    'reports',
    'bank',
    'indicators',
  ]

  if(RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch: routesWithSidebarMenu })) {
    isUnitaryViewVisible = true
  }

  return isUnitaryViewVisible
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
  const routesWithActiveWallet = ['wallet', 'wallet-client']
  if(RouterHelpers.isRouteOrAncestorActive({ route, routesToMatch: routesWithActiveWallet })) {
    return 'sidenav-entity__actions-active'
  }

  return ''
})

const onEntitySelected = (entity: Entity) => {
  SelectedEntityManager.persistSelectedEntity(entity)
}
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
  background-color: var(--el-color-base-blue-pulse);
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
      color: var(--el-color-base-white);
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
    margin-top: 56px;

    &-icon {
      width: var(--default-size);
      transition: all var(--smooth-transition);
    }

    &-active {
      z-index: 10;
      position: relative;
      background-color: rgba(var(--el-color-base-persian-light-rgb), 0.2);
      border-right: 6px solid var(--el-color-base-persian-light);

      #{$actions}-wallet-text {
        font-weight: 600;
        color: var(--el-color-base-white);
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
      color: var(--el-color-base-white);
      font-weight: 400;
      transition: all var(--smooth-transition);
    }
  }

  &__favorites {
    gap: 12px;
    overflow-y: scroll;
    overscroll-behavior-y: contain;

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
    background-color: var(--el-color-base-blue-pulse);

    #{$self}__actions-active {
      background-color: rgba(var(--el-color-secondary-fuschia-bg-rgb), 0.2);
      border-right-color: var(--el-color-secondary-fuschia-bg);
    }
  }

  &--no-entity-selected {
    #{$self}__actions-active {
      background-color: rgba(var(--el-color-base-white-rgb), 0.2) !important;
      border-right-color: var(--el-color-base-white) !important;
    }
  }
}
</style>

<i18n lang="yaml">
en-US:
  open: 'Open'
  close: 'Close'
  favorites: 'Favorites'
  globalView: 'Global view'
fr-FR:
  open: 'Ouvrir'
  close: 'Fermer'
  favorites: 'Favoris'
  globalView: 'Vue globale'
</i18n>
