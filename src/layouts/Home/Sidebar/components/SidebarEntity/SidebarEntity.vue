<template>
  <nav
    :class="['sidenav-entity', { 'sidenav-entity--opened': isSidebarOpened }]"
  >
    <!-- Sidebar items -->
    <ul
      class="sidenav-entity__actions flex flex--direction-column"
    >
      <li
        :class="{
          'text-right sidenav-entity__actions-toggle-item': isSidebarOpened
        }"
      >
        <SidebarEntityItem
          :tooltipContent="isSidebarOpened ? t('close') : t('open')"
          :tooltipDisabled="isToggleTooltipDisabled"
          :class="`sidenav-entity__actions-toggle--${
            isSidebarOpened ? 'open' : 'close'
          }`"
          @item-clicked="onOpenCloseSidebar"
          data-testid="open-close-toggle"
        >
          <PIcon
            color="#FFF"
            class="sidenav-entity__actions-icon radius--circle"
          >
            <PIArrowBarLeft v-if="isSidebarOpened" />
            <PIArrowBarRight v-else />
          </PIcon>
        </SidebarEntityItem>
      </li>
      <li
        class="sidenav-entity__actions-wallet flex flex--align-items-center margin-top--1"
        :class="activeItem(walletItem.route)"
        data-testid="wallet-item"
      >
        <SidebarEntityItem v-bind="walletItem">
          <PIcon
            :color="activeItem(walletItem.route) ? '#5546FF' : '#FFF'"
            class="sidenav-entity__actions-icon radius--circle"
            :class="isSidebarOpened ? 'margin-right--2' : 'margin-right--3'"
          >
            <PICardList />
          </PIcon>
          <template #suffix-content>
            <p class="sidenav-entity__actions-wallet-text">
              {{ t('wallet') }}
            </p>
          </template>
        </SidebarEntityItem>
      </li>
      <li
        v-if="selectedEntity"
        :class="activeItem(selectedEntityRoute)"
        class="flex flex--align-items-center margin-top--4 is-entity"
        data-testid="selected-entity"
      >
        <EntityAvatar
          :entity="selectedEntity"
          :hideTooltip="isSidebarOpened"
          :class="{
            'sidenav__selected-item': activeItem(selectedEntityRoute)
          }"
        />
      </li>
    </ul>
    <!-- Star Favorites Divider -->
    <div
      class="sidenav-entity__star-divider flex flex--align-items-center margin-top--6 margin-bottom--1"
    >
      <div class="sidenav-entity__star-divider-icon" data-testid="star-divider">
        <PIcon
          size="12"
          color="#C2C9FF"
          style="width: 32px"
        >
          <PIStarFill />
        </PIcon>
      </div>
      <p
        class="sidenav-entity__star-divider-text"
        :class="{ 'margin-left--3': !isSidebarOpened }"
      >
        {{ t('favorites') }}
      </p>
    </div>
    <!-- Favorites Entities -->
    <ul
      class="sidenav-entity__favorites flex flex--direction-column"
      data-testid="favorites-entities"
    >
      <li v-for="(favoriteEntity, index) in favoritesEntities" :key="index">
        <EntityAvatar
          data-testid="favorite-entity"
          :entity="favoriteEntity"
          :hideTooltip="isSidebarOpened"
          :selected="favoriteEntity.ibs === selectedEntity?.ibs"
          @entity-selected="onEntitySelected"
        />
      </li>
    </ul>
  </nav>
</template>

<i18n lang="yaml">
en-US:
  open: 'Open'
  close: 'Close'
  favorites: 'Favorites'
  wallet: 'My Wallet'
fr-FR:
  open: 'Ouvrir'
  close: 'Fermer'
  favorites: 'Favoris'
  wallet: 'Mon Portefeuille'
</i18n>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  PIArrowBarRight,
  PIArrowBarLeft,
  PICardList,
  PIStarFill,
  PIcon
} from '@kpmg/styleguide'
import { getMockedFavoritedEntites } from './MockedFavoritedEntites'
import type { Entity } from './components/EntityAvatar/EntityAvatarTypes'
import type { SidebarEntityItemProps } from './components/SidebarEntityItem/SidebarEntityItemTypes'
import SidebarEntityItem from './components/SidebarEntityItem'
import EntityAvatar from './components/EntityAvatar'

const route = useRoute()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const isSidebarOpened = ref(false)
const isToggleTooltipDisabled = ref(false)
// The following code is temporary; we will create a service later to retrieve data from the API
const favoritesEntities: Entity[] = getMockedFavoritedEntites()
const selectedEntity = ref<Entity | undefined>(undefined)

const walletItem = computed((): SidebarEntityItemProps => {
  return {
    tooltipContent: t('wallet'),
    tooltipDisabled: isSidebarOpened.value,
    route: { name: 'wallet' }
  }
})

const onOpenCloseSidebar = () => {
  isToggleTooltipDisabled.value = true
  isSidebarOpened.value = !isSidebarOpened.value

  // To avoid simultaneous display of the next tooltip ('Close'/'Open')
  setTimeout(() => {
    isToggleTooltipDisabled.value = false
  }, 100)
}

const activeItem = (itemRoute: any) => {
  const routeName = route.matched?.at(0)?.name ?? route.name
  return itemRoute && itemRoute.name === routeName
    ? 'sidenav-entity__actions-active'
    : ''
}

const selectedEntityRoute = computed(() => {
  // It's just a temporary route; it will be changed later
  return { name: 'folder' }
})

const onEntitySelected = (entity: Entity) => {
  selectedEntity.value = entity
  localStorage.setItem('selected-entity', JSON.stringify(entity))
}

onMounted(() => {
  const savedSelectedEntity = localStorage.getItem('selected-entity')
  if (savedSelectedEntity) {
    selectedEntity.value = JSON.parse(savedSelectedEntity)
  }
})
</script>

<style scoped lang="scss">
.sidenav-entity {
  --default-size: 32px;
  --shadow-color: rgba(85, 70, 255, 0);
  --smooth-transition: 0.4s ease;

  position: sticky;
  top: 0;
  width: 54px;
  height: 100vh;
  padding-left: 10px;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: var(--el-color-base-persian);
  transition: width var(--smooth-transition);

  &--opened {
    width: 240px;
  }

  &__actions,
  &__favorites {
    list-style: none;
  }

  &__star-divider {
    &-icon {
      width: var(--default-size);
      margin-right: 1px;
    }

    &-text {
      color: var(--el-color-persian-200);
      font-size: 1.2rem;
      font-weight: 600;
      transition: all var(--smooth-transition);
    }
  }

  &__actions {
    $actions: &;
    margin-top: 72px;
    gap: 8px;

    &-icon {
      width: var(--default-size);
      height: var(--default-size);
      transition: all var(--smooth-transition);

      &:hover {
        background-color: var(--el-color-persian-400);
      }
    }

    &-active {
      --curves-h: 22px;
      z-index: 10;
      position: relative;
      height: var(--default-size);
      border-radius: 24px 0px 0px 24px;
      background-color: var(--el-color-base-white);

      &::before,
      &::after {
        content: '';
        position: absolute;
        right: 0;
        width: 26px;
        height: var(--curves-h);
        background: transparent;
      }

      &::before {
        top: calc(var(--curves-h) * -1);
        border-radius: 0px 0px 24px;
        box-shadow: 5px 5px 0 3px var(--el-color-base-white);
      }

      &::after {
        bottom: calc(var(--curves-h) * -1);
        border-radius: 0px 24px 0px 0px;
        box-shadow: 5px -5px 0 3px var(--el-color-base-white);
      }

      &.is-entity {
        background-color: var(--el-color-persian-200);

        &:before {
          box-shadow: 5px 5px 0 3px var(--el-color-persian-200);
        }

        &:after {
          box-shadow: 5px -5px 0 3px var(--el-color-persian-200);
        }
      }

      #{$actions}-wallet-text {
        font-weight: 600;
        color: var(--el-color-base-persian);
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

    li:first-child {
      margin-top: 12px;
    }

    li:last-child {
      margin-bottom: 16px;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    &::before {
      content: '';
      z-index: 10;
      position: absolute;
      left: 0;
      width: 100%;
      height: 14px;
      background: linear-gradient(
        180deg,
        var(--el-color-base-persian) 0%,
        var(--shadow-color) 100%
      );
    }
  }

  &::after {
    content: '';
    z-index: 10;
    position: absolute;
    bottom: 16px;
    left: 0;
    width: 100%;
    height: 14px;
    background: linear-gradient(
      180deg,
      var(--shadow-color) 0%,
      var(--el-color-base-persian) 100%
    );
  }
}
</style>
