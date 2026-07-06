<template>
  <ElSkeletonItem
    :variant="pVariant"
    :style="itemStyle"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElSkeletonItem } from 'element-plus'
import type { CSSProperties } from 'vue'
import type { PSkeletonItemProps } from './PSkeletonTypes'

const props = withDefaults(defineProps<PSkeletonItemProps>(), {
  pVariant: 'text',
})

const toCssSize = (value: string | number | undefined): string | undefined => {
  if (value === undefined) {
    return undefined
  }
  return typeof value === 'number' ? `${value}px` : value
}

// Element Plus animates every item on the same 1.4s timeline, so all items shimmer in lockstep.
// A per-item random negative delay offsets each item's phase (without delaying its visible start)
// for a more chaotic wave. Inline animation-delay outranks Element Plus's `animation` shorthand.
const SKELETON_ANIMATION_DURATION_S = 1.4
const animationDelay = `-${(Math.random() * SKELETON_ANIMATION_DURATION_S).toFixed(2)}s`

const itemStyle = computed<CSSProperties>(() => ({
  width: toCssSize(props.pWidth),
  height: toCssSize(props.pHeight),
  animationDelay,
}))
</script>
