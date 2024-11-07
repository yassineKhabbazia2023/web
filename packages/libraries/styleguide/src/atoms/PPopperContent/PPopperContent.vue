<template>
  <ElPopperContent
    :boundariesPadding="pBoundariesPadding"
    :fallbackPlacements="pFallbackPlacements"
    :gpuAcceleration="pGpuAcceleration"
    :offset="pOffset"
    :placement="pPlacement"
    :popperOptions="pPopperOptions"
    :strategy="pStrategy"
  >
    <slot />
  </ElPopperContent>
</template>

<script lang="ts" setup>
import { ElPopperContent } from 'element-plus'
import type { PPopperContentProps } from './PPopperContentTypes'

withDefaults(defineProps<PPopperContentProps>(), {
  pBoundariesPadding: 0,
  pFallbackPlacements: undefined,
  pGpuAcceleration: true,
  pOffset: 12,
  pPlacement: 'bottom',
  pPopperOptions: () => ({}),
  pStrategy: 'absolute',
})
</script>
