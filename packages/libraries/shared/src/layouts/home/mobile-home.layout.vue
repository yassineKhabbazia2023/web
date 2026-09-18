<template>
  <div
    class="mobile-home-layout"
    data-testid="mobile-home-layout"
  >
    <MobileUserMenu
      v-model:is-drawer-opened="hasUserMenuOpened"
      data-testid="mobile-home-user-menu"
    />

    <PContainer pDirection="vertical">
      <PCHeader
        class="mobile-home-layout__header padding--0"
        :height="String(MOBILE_BOTTOM_NAV_HEIGHT)"
      >
        <MobileHeader
          :current-entity="currentEntity"
          @show-user-profile-drawer="handleShowUserMenu"
        >
          <template #header-actions>
            <slot name="header-actions" />
          </template>
        </MobileHeader>
      </PCHeader>

      <PContainer
        class="mobile-home-layout__main"
        :class="hasMobilePadding ? 'padding--4' : 'padding--0'"
      >
        <slot name="banner" />
        <ContentLoader v-show="isContentLoading === true" />
        <router-view v-show="isContentLoading === false" />
      </PContainer>
    </PContainer>

    <MobileBottomNav
      v-if="isCollab === true || currentEntity !== undefined"
      :current-entity-id="currentEntity?.accountId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { PCHeader, PContainer } from '@pulse/styleguide/components'
import { ContentLoader } from '@pulse/shared/components'
import { LAYOUT_MOBILE_NO_PADDING_META } from '@pulse/common/constants'
import { useLoadingStore, useUserStore } from '@pulse/common/stores'
import { MobileHeader } from './header'
import { MobileBottomNav, MobileUserMenu } from './navigation'
import type { MobileHomeLayoutProps } from './home.layout.types'
import { MOBILE_BOTTOM_NAV_HEIGHT } from './mobile-home.const'

const router = useRouter()
const { isContentLoading } = storeToRefs(useLoadingStore())
const { isCollab } = storeToRefs(useUserStore())
const hasUserMenuOpened = ref(false)

/** Every route keeps the gutter of the layout unless it asked to draw its own. */
const hasMobilePadding = computed(
  () => router.currentRoute.value?.meta[LAYOUT_MOBILE_NO_PADDING_META] !== true,
)

defineProps<MobileHomeLayoutProps>()

const handleShowUserMenu = () => {
  hasUserMenuOpened.value = true
}
</script>

<style lang="scss" scoped>
$mobile-bottom-nav-height: v-bind('`${MOBILE_BOTTOM_NAV_HEIGHT}px`');

.mobile-home-layout {
  &__main {
    display: block;
    position: relative;
    width: 100%;
    height: calc(100vh - var(--p-header-height) - #{$mobile-bottom-nav-height} - env(safe-area-inset-bottom));
    height: calc(100dvh - var(--p-header-height) - #{$mobile-bottom-nav-height} - env(safe-area-inset-bottom));
    margin-top: var(--p-header-height);
    overflow: auto;
  }
}
</style>
