<template>
  <div class="p-sticky-bar" :style="{ top }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'PStickyBar',
})

withDefaults(defineProps<{
  top?: CSSProperties['top']
}>(), {
  top: 0,
})
</script>

<style scoped lang="scss">
.p-sticky-bar {
  position: sticky;
  z-index: 10;
}
</style>
