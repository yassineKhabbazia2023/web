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

<style lang="scss">
// Element Plus maps --el-skeleton-circle-size to --el-avatar-size
// which is only set on .el-avatar elements, not globally
.el-skeleton {
  --el-skeleton-circle-size: 40px;
}
</style>
