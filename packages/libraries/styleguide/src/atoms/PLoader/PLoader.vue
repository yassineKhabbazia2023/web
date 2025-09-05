<template>
  <PIcon
    class="p-loader"
    :size="pSize"
  >
    <component
      :is="iconToLoad"
      class="p-loader__icon"
      :class="iconClassNameModifier"
    />
  </PIcon>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PIcon from '../PIcon'
import { getIconComponent } from '../../utils/iconHelper'
import type { PLoaderProps } from './PLoaderTypes'

const props = withDefaults(defineProps<PLoaderProps>(), {
  pType: 'default',
  pSize: '',
})

const iconToLoad = computed(() => {
  return props.pType === 'gradient'
    ? getIconComponent('loaderGradient')
    : getIconComponent('loader')
})

const iconClassNameModifier = computed(() => `p-loader__icon--type-${props.pType}`)
</script>

<style lang="scss">
.p-loader {
  .p-loader__icon {
    animation: spin 2s linear infinite;

    &--type-default {
      color: var(--p-gray-300);
    }
    &--type-primary {
      color: var(--p-jungle-400);
    }
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
