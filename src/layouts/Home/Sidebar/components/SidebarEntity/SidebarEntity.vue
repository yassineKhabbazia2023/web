<template>
  <div :class="{ 'padding-right--0': !isSelectedEntityActive }">
    <nav
      v-if="(!isCollab && totalEntities > 1) || isCollab"
      :class="[
        'sidenav-entity flex flex--direction-column',
        { 'sidenav-entity--opened': isSidebarOpened },
        { 'sidenav-entity--is-collab': isCollab }
      ]"
      data-testid="sidenav-entity"
    >
      <!-- Sidebar items -->
      <ul class="sidenav-entity__actions flex flex--direction-column">
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
            @item-clicked="onToggleSidebar"
            data-testid="sidebar-toggle"
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
          :class="getActiveWallet"
          data-testid="wallet-item"
        >
          <SidebarEntityItem v-bind="walletItem">
            <PIcon
              :color="getActiveWallet ? '#5546FF' : '#FFF'"
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
          :class="isSelectedEntityActive"
          class="flex flex--align-items-center margin-top--4 is-entity"
          data-testid="selected-entity"
        >
          <EntityAvatar
            :entity="selectedEntity"
            :hideTooltip="isSidebarOpened"
            :class="{
              'sidenav__selected-item': isSelectedEntityActive
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
              :selected="favoriteEntity.idAccount === selectedEntity?.idAccount"
              @entity-selected="onEntitySelected"
            />
          </li>
        </ul>
      </template>
    </nav>
    <SidebarEntityMenu
      v-if="isSelectedEntityActive && selectedEntity"
      :selectedEntityId="selectedEntity.idAccount"
    />
  </div>
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
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { commonStore, type Entity } from '@kpmg/common'
import {
  PIArrowBarRight,
  PIArrowBarLeft,
  PICardList,
  PIStarFill,
  PIcon
} from '@kpmg/styleguide'
import type { SidebarEntityItemProps } from './components/SidebarEntityItem/SidebarEntityItemTypes'
import type { SidebarEntityProps } from './SidebarEntityTypes'
import SidebarEntityItem from './components/SidebarEntityItem'
import SidebarEntityMenu from './components/SidebarEntityMenu'
import EntityAvatar from './components/EntityAvatar'

const route = useRoute()
const userStore = commonStore()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<SidebarEntityProps>()

const { user, defaultEntity, favoriteEntities, isCollab } = storeToRefs(userStore)
const isSidebarOpened = ref(false)
const isToggleTooltipDisabled = ref(false)
const selectedEntity = ref<Entity | undefined>(undefined)

const walletItem = computed((): SidebarEntityItemProps => {
  return {
    tooltipContent: t('wallet'),
    tooltipDisabled: isSidebarOpened.value,
    route: { name: isCollab.value ? 'wallet' : 'wallet-client' }
  }
})

const isSelectedEntityActive = computed(() => {
  return (
    selectedEntity.value &&
    activeItem({
      name: 'folder',
      params: { id: selectedEntity.value.idAccount }
    })
  )
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
    ? 'sidenav-entity__actions-active'
    : ''
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
        default: entity
      }
    }
  })
}

const onEntitySelected = (entity: Entity) => {
  selectedEntity.value = entity
  patchDefaultEntity(entity)
  localStorage.setItem('selected-entity', JSON.stringify(entity))
}

watch(
  user,
  () => {
    selectedEntity.value = defaultEntity.value as Entity
  },
  { deep: true }
)

onMounted(() => {
  // The following code is temporary and will be replaced later
  const savedSelectedEntity = localStorage.getItem('selected-entity')
  if (savedSelectedEntity) {
    selectedEntity.value = JSON.parse(savedSelectedEntity)
    patchDefaultEntity(selectedEntity.value as Entity)
  } else {
    if (!isCollab.value && props.totalEntities === 1) {
      selectedEntity.value = defaultEntity?.value
    }
  }
})
</script>

<style scoped lang="scss">
.sidenav-entity {
  $self: &;
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
  overflow: hidden;

  &--opened {
    width: 240px;
  }

  &#{$self}--is-collab {
    background-color: var(--el-color-base-blue-kpmg);

    #{$self}__favorites {
      &::before {
        background: linear-gradient(
          180deg,
          var(--el-color-base-blue-kpmg) 0%,
          var(--shadow-color) 100%
        );
      }
    }
    &::after {
      background: linear-gradient(
        180deg,
        var(--shadow-color) 0%,
        var(--el-color-base-blue-kpmg) 100%
      );
    }
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
        background-color: var(--el-color-persian-100);

        &:before {
          box-shadow: 5px 5px 0 3px var(--el-color-persian-100);
        }

        &:after {
          box-shadow: 5px -5px 0 3px var(--el-color-persian-100);
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
    bottom: 0;
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
