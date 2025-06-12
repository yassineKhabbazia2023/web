<template>
  <div
    class="
      p-overlay
      flex
      flex--justify-content-center
      position--relative
      z-index-1000
      min-width--full
      height--100vh
      cursor-pointer
    "
    :class="{
      'p-overlay--hasOverEffect': pHasOverEffect === true,
    }"
  >
    <div
      class="
        p-overlay__background
        position--absolute
        min-width--full
        height--100vh
      "
      :class="backgroundCssClass"
    />
    <div
      class="p-overlay__content z-index-1001"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { POverladyProps } from './POverlay.types'

const props = defineProps<POverladyProps>()

const backgroundCssClass = computed(() => props.pBackgroundColor === undefined
  ? undefined
  : `bg--${props.pBackgroundColor}`)
</script>

<style lang="scss" scoped>
.p-overlay {
  $self: &;
  &:not(&--hasOverEffect) {
    #{$self}__background {
      opacity: 0.5;
    }
  }
  &--hasOverEffect {
    #{$self}__background {
      opacity: 0;
    }
    #{$self}__content {
      display: none;
    }
    &:hover {
      #{$self}__background {
        opacity: 0.5;
      }
      #{$self}__content {
        display: inherit;
      }
    }
  }
}
</style>
