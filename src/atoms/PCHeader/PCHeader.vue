<template>
  <ElHeader :height="pHeight">
    <slot />
  </ElHeader>
</template>

<script lang="ts" setup>
import { ElHeader } from 'element-plus'
import type { PCHeaderProps } from './PCHeaderTypes'

withDefaults(defineProps<PCHeaderProps>(), {
  pHeight: '60px'
})
</script>
