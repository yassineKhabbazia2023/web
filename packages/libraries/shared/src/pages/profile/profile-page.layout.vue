<template>
  <div class="profile-page-layout">
    <div
      :id="footerId"
      class="profile-page-layout__footer flex flex--justify-content-flex-end padding--4"
    />
    <div class="profile-page-layout__content padding--4">
      <PTitle
        :pTitle="title"
        class="margin-bottom--6"
      />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PTitle } from '@pulse/styleguide/components'
import { MOBILE_BOTTOM_NAV_HEIGHT } from '@shared/layouts/home/mobile-home.const'
import type { ProfilePageLayoutProps } from './profile-page.layout.type'

defineProps<ProfilePageLayoutProps>()
</script>

<style lang="scss" scoped>
$mobile-bottom-nav-height: v-bind('`${MOBILE_BOTTOM_NAV_HEIGHT}px`');

.profile-page-layout {
  &__content {
    padding-bottom: 140px;
  }

  &__footer {
    position: fixed;
    bottom: calc(#{$mobile-bottom-nav-height} + env(safe-area-inset-bottom));
    left: 0;
    right: 0;
    background: var(--p-white);
  }
}
</style>
