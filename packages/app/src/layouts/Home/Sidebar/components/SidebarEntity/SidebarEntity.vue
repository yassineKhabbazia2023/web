<template>
  <div :class="{ 'padding-right--0': !isSelectedEntityActive }">
    <nav
      v-if="(!isCollab && entities.length > 1) || isCollab"
      :class="[
        'sidenav-entity flex flex--direction-column',
        { 'sidenav-entity--opened': isSidebarOpened },
        { 'sidenav-entity--is-collab': isCollab },
      ]"
      data-testid="sidenav-entity"
    >
      <!-- Sidebar items -->
      <ul class="sidenav-entity__actions flex flex--direction-column">
        <li
          :class="{
            'text-right sidenav-entity__actions-toggle-item': isSidebarOpened,
          }"
        >
          <SidebarEntityItem
            :tooltipContent="isSidebarOpened ? t('close') : t('open')"
            :tooltipDisabled="isToggleTooltipDisabled"
            :class="`sidenav-entity__actions-toggle--${
              isSidebarOpened ? 'open' : 'close'
            }`"
            data-testid="sidebar-toggle"
            @item-clicked="onToggleSidebar"
          >
            <PIcon
              :pName="isSidebarOpened ? 'arrowBarLeft' : 'arrowBarRight'"
              :color="AppColors.WHITE"
              class="sidenav-entity__actions-icon radius--circle"
            />
          </SidebarEntityItem>
        </li>
        <li
          class="sidenav-entity__actions-wallet flex flex--align-items-center margin-top--1"
          :class="getActiveWallet"
          data-testid="wallet-item"
        >
          <SidebarEntityItem v-bind="walletItem">
            <PIcon
              :color="AppColors.WHITE"
              class="sidenav-entity__actions-icon radius--circle"
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
          :class="isSelectedEntityActive"
          class="flex flex--align-items-center margin-top--4 is-entity"
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
          <div
            class="sidenav-entity__star-divider-icon"
            data-testid="star-divider"
          >
            <PIcon
              size="12"
              :color="AppColors.WHITE"
              style="width: 32px"
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
          v-if="favoriteEntities.length"
          class="sidenav-entity__favorites flex flex--direction-column"
          data-testid="favorite-entities"
        >
          <li v-for="(favoriteEntity, index) in favoriteEntities" :key="index">
            <EntityAvatar
              data-testid="favorite-entity"
              :entity="favoriteEntity"
              :hideTooltip="isSidebarOpened"
              :selected="favoriteEntity.accountId === selectedEntity?.accountId"
              @entity-selected="onEntitySelected"
            />
          </li>
        </ul>
      </template>
      <AppVersion v-if="isSidebarOpened" />
    </nav>
    <SidebarEntityMenu
      v-if="isSelectedEntityActive && selectedEntity"
      :selectedEntityId="selectedEntity.accountId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { commonStore } from '@pulse/common'
import type { Entity } from '@pulse/common/types'
import { PIcon } from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { SidebarEntityItemProps } from './components/SidebarEntityItem/SidebarEntityItemTypes'
import type { SidebarEntityProps } from './SidebarEntityTypes'
import { getDefaultEntity } from './utils'
import SidebarEntityItem from './components/SidebarEntityItem'
import SidebarEntityMenu from './components/SidebarEntityMenu'
import EntityAvatar from './components/EntityAvatar'
import AppVersion from './components/AppVersion'

const route = useRoute()
const userStore = commonStore()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<SidebarEntityProps>()

const { favoriteEntities, isCollab } = storeToRefs(userStore)
const isSidebarOpened = ref(false)
const isToggleTooltipDisabled = ref(false)
const selectedEntity = ref<Entity | undefined>(undefined)

const walletItem = computed((): SidebarEntityItemProps => {
  return {
    tooltipContent: t('globalView'),
    tooltipDisabled: isSidebarOpened.value,
    route: { name: isCollab.value ? 'wallet' : 'wallet-client' },
  }
})

const isSelectedEntityActive = computed(() => {
  if (!selectedEntity.value?.accountId) {
    return false
  }

  const params = {
    id: selectedEntity.value.accountId,
  }

  const isUnitaryViewVisible = [
    'folder',
    'ged',
    'launcher',
    'reports',
    'bank',
    'indicators',
  ].some((route) =>
    activeItem({
      name: route,
      params,
    }),
  )

  return isUnitaryViewVisible ? 'sidenav-entity__actions-active' : ''
})

const onToggleSidebar = () => {
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
}

const getActiveWallet = computed(() => {
  const routeName = route.matched?.at(0)?.name ?? route.name
  if (['wallet', 'wallet-client'].includes(routeName as string)) {
    return 'sidenav-entity__actions-active'
  }
  return ''
})

const patchDefaultEntity = (entity: Entity) => {
  userStore.$patch({
    user: {
      entities: {
        default: entity,
      },
    },
  })
  userStore.fetchUserAccountPermissions()
}

const onEntitySelected = (entity: Entity) => {
  selectedEntity.value = entity
  patchDefaultEntity(entity)
  localStorage.setItem('selected-entity', JSON.stringify(entity))
}

onMounted(() => {
  selectedEntity.value = getDefaultEntity(props.entities[0])
  patchDefaultEntity(selectedEntity.value as Entity)
})
</script>

<style scoped lang="scss">
.sidenav-entity {
  $self: &;
  --default-size: 32px;
  --smooth-transition: 0.4s ease;

  position: sticky;
  top: 0;
  width: 54px;
  height: 100vh;
  flex-grow: 0;
  flex-shrink: 0;
  background-color: var(--el-color-base-blue-pulse);
  transition: width var(--smooth-transition);
  overflow: hidden;

  &--opened {
    width: 240px;
  }

  // FIXME: nécessaire de garder ça ?
  &#{$self}--is-collab {
    background-color: var(--el-color-base-blue-pulse);

    #{$self}__actions-active {
      background-color: rgba(var(--el-color-persian-50-rgb), 0.2);
      border-right: 6px solid var(--el-color-persian-50);
    }
  }

  &__actions,
  &__favorites {
    list-style: none;
  }

  &__star-divider {
    padding-left: 10px;
    &-icon {
      width: var(--default-size);
      margin-right: 1px;
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
      padding-left: 10px;
    }

    $actions: &;
    margin-top: 72px;
    gap: 8px;

    &-icon {
      width: var(--default-size);
      height: var(--default-size);
      transition: all var(--smooth-transition);

      &:hover {
        background-color: rgba(var(--el-color-secondary-amethyste-rgb), 0.2);
      }
    }

    &-active {
      z-index: 10;
      position: relative;
      height: var(--default-size);
      background-color: rgba(var(--el-color-secondary-amethyste-rgb), 0.2);
      border-right: 6px solid var(--el-color-persian-600);

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
      padding-left: 10px;
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
