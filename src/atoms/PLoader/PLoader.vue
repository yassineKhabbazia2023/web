<template>
  <PIcon
    class="p-loader"
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
import { iconResolver } from '@/utils/iconResolver'

type PLoaderProps = {
  type?: 'default' | 'primary' | 'gradient';
};

const props = withDefaults(defineProps<PLoaderProps>(), {
  type: 'default'
})

const iconToLoad = computed(() => {
  return props.type === 'gradient'
    ? iconResolver('PILoaderGradient')
    : iconResolver('PILoader')
})

const iconClassNameModifier = computed(() => `p-loader__icon--${props.type}`)
</script>

<style lang="scss">
.p-loader {
  .p-loader__icon {
    animation: spin 2s linear infinite;

    &--default {
      color: var(--el-color-neutral-gray-300);
    }
    &--primary {
      color: var(--el-color-persian-500);
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
