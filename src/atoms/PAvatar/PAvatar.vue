<template>
  <ElAvatar v-bind="props">
    <slot />
  </ElAvatar>
</template>

<script setup lang="ts">
import { ElAvatar } from 'element-plus'
import type { PAvatarProps } from './PAvatar'

const props = withDefaults(defineProps<PAvatarProps>(), {
  type: 'default',
  size: 'default',
  fit: 'cover',
  color: 'persian-gradient',
  src: ''
})
</script>
