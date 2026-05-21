<template>
  <ElSkeletonItem
    :variant="pVariant"
    :style="sizeStyle"
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

const sizeStyle = computed<CSSProperties>(() => ({
  width: toCssSize(props.pWidth),
  height: toCssSize(props.pHeight),
}))
</script>
