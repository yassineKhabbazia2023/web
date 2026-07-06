<template>
  <ElSkeleton
    :animated="pAnimated"
    :count="pCount"
    :rows="pRows"
    :loading="pLoading"
    :throttle="pThrottle"
  >
    <template #default>
      <slot />
    </template>
    <template #template>
      <slot name="template" />
    </template>
  </ElSkeleton>
</template>

<script lang="ts" setup>
import { ElSkeleton } from 'element-plus'
import type { PSkeletonProps } from './PSkeletonTypes'

withDefaults(defineProps<PSkeletonProps>(), {
  pAnimated: true,
  pCount: 1,
  pRows: 3,
  pLoading: true,
})
</script>
