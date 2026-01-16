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
        height="56"
      >
        <MobileHeader :current-entity="currentEntity" />
      </PCHeader>

      <PContainer class="mobile-home-layout__main padding--4">
        <router-view />
      </PContainer>
    </PContainer>

    <MobileBottomNav
      v-if="currentEntity"
      :current-entity-id="currentEntity.accountId"
      :is-menu-active="hasUserMenuOpened"
      @show-user-profile-drawer="handleShowUserMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PCHeader, PContainer } from '@pulse/styleguide/components'
import { MobileHeader } from '../mobile-header'
import { MobileBottomNav } from '../navigation/components/mobile/mobile-bottom-nav'
import { MobileUserMenu } from '../navigation/components/mobile/mobile-user-menu'
import type { MobileHomeLayoutProps } from '../../layouts.types'

const hasUserMenuOpened = ref(false)

defineProps<MobileHomeLayoutProps>()

const handleShowUserMenu = () => {
  hasUserMenuOpened.value = true
}
</script>

<style lang="scss" scoped>
.mobile-home-layout {
  &__main {
    display: block;
    position: relative;
    width: 100%;
    height: calc(100vh - var(--p-header-height) - 56px - env(safe-area-inset-bottom));
    margin-top: var(--p-header-height);
    overflow: auto;
  }
}
</style>
