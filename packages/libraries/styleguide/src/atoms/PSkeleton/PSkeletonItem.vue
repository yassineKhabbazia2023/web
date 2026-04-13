<template>
  <ElSkeletonItem :variant="pVariant" />
</template>

<script lang="ts" setup>
import { ElSkeletonItem } from 'element-plus'
import type { PSkeletonItemProps } from './PSkeletonTypes'

withDefaults(defineProps<PSkeletonItemProps>(), {
  pVariant: 'text',
})
</script>
