<template>
  <div
    class="
      p-overlay
      flex
      flex--justify-content-center
      position--relative
      z-index-1000
      min-width--full
      cursor-pointer
    "
    :class="{
      'p-overlay--vignette': pIsVignette === true,
      'p-overlay--hasOverEffect': pHasOverEffect === true,
      'height--100': pIsVignette === true,
      'height--100vh': pIsVignette === false,
    }"
  >
    <div
      class="
        p-overlay__background
        position--absolute
        min-width--full
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
import type { POverlayProps } from './POverlay.types'

const props = defineProps<POverlayProps>()

const backgroundCssClass = computed(() => {
  const cssClasses: string[] = []

  if (props.pIsVignette === false) {
    cssClasses.push('height--100vh')
  }
  if (props.pIsVignette === true) {
    cssClasses.push('height--100')
  }

  if (props.pBackgroundColor !== undefined) {
    cssClasses.push(`bg--${props.pBackgroundColor}`)
  }

  return cssClasses
})
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
        display: block;
      }
    }
  }
}
</style>
